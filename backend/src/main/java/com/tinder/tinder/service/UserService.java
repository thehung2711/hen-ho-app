package com.tinder.tinder.service;

import com.tinder.tinder.dto.request.CreateInforUser;
import com.tinder.tinder.dto.request.RegisterRequest;
import com.tinder.tinder.dto.request.UserUpdate;
import com.tinder.tinder.dto.response.*;
import com.tinder.tinder.enums.RoleName;
import com.tinder.tinder.enums.StatusName;
import com.tinder.tinder.exception.AppException;
import com.tinder.tinder.exception.ErrorException;
import com.tinder.tinder.jwt.JwtUtil;
import com.tinder.tinder.mapper.UserSettingMapper;
import com.tinder.tinder.model.*;
import com.tinder.tinder.repository.*;
import com.tinder.tinder.enums.RoleName;
import com.tinder.tinder.model.Images;
import com.tinder.tinder.model.Interests;
import com.tinder.tinder.model.Users;
import com.tinder.tinder.repository.ImagesRepository;
import com.tinder.tinder.repository.InterestRepository;
import com.tinder.tinder.repository.UserRepository;
import com.tinder.tinder.service.impl.IUserService;
import com.tinder.tinder.utils.GraphHopperService;
import com.tinder.tinder.utils.OSMService;
import com.tinder.tinder.utils.UserMapper;
import com.tinder.tinder.utils.UtilsService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilsService utilsService;
    private final ImagesService imagesService;
    private final InterestRepository interestRepository;
    private final OSMService osmService;
    private final UserMapper userMapper;
    private final GraphHopperService graphHopperService;
    private final ImagesRepository imagesRepository;
    private final LikeRepository likeRepository;
    private final MatchRepository matchRepository;
    private final UserSettingMapper userSettingMapper;
    private final JavaMailSender mailSender;
    private final MessageRepository messageRepository;
    @PersistenceContext
    private EntityManager entityManager;
    private final double WEIGHT_SCORE = 0.7;
    private final double DISTANCE_SCORE = 1 - WEIGHT_SCORE;
    private final long tempPasswordExpiryHours = 24;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UtilsService utilsService,
                       ImagesService imagesService, InterestRepository interestRepository, OSMService osmService,
                       GraphHopperService graphHopperService, ImagesRepository imagesRepository, LikeRepository likeRepository,
                       MatchRepository matchRepository, UserMapper userMapper, UserSettingMapper userSettingMapper,
                       JavaMailSender mailSender, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.utilsService = utilsService;
        this.imagesService = imagesService;
        this.interestRepository = interestRepository;
        this.osmService = osmService;
        this.userMapper = userMapper;
        this.graphHopperService = graphHopperService;
        this.imagesRepository = imagesRepository;
        this.likeRepository = likeRepository;
        this.matchRepository = matchRepository;
        this.userSettingMapper = userSettingMapper;
        this.mailSender = mailSender;
        this.messageRepository = messageRepository;
    }

    @Override
    public void createUser(RegisterRequest request) {
        Optional<Users> userOptional = Optional.ofNullable((userRepository.findByUsername(request.getUsername())));
        if(userOptional.isPresent()) {
            throw new AppException(ErrorException.USERNAME_IS_EXISTED);
        }
        if(request.getPassword().compareTo(request.getConfirmPassword()) != 0){
            throw new AppException(ErrorException.CONFIRM_PASS_NOT_VALID);
        }
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(RoleName.ROLE_USER);
        userRepository.save(user);
    }

    @Override
    public void updateInforUser(CreateInforUser inforUser) {
        Long userId = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            user.setFullName(inforUser.getFullName());
            user.setEmail(inforUser.getEmail());
            user.setAddressLat(inforUser.getAddressLat());
            user.setAddressLon(inforUser.getAddressLon());
            user.setBirthday(inforUser.getBirthday());
            user.setGender(inforUser.getGender());
            user.setInterestedIn(inforUser.getInterestedIn());
            user.setBio(inforUser.getBio());
            user.setCompany(inforUser.getCompany());
            user.setTall(inforUser.getTall());
            user.setSchool(inforUser.getSchool());
            user.setDistanceRange(10.0);
            user.setMinAge(1);
            user.setMaxAge(36);
            List<Interests> interestsList = interestRepository.findAllById(inforUser.getInterestIds());
            user.setInterests(interestsList);
            user.setLocation(osmService.getLocationName(inforUser.getAddressLat(), inforUser.getAddressLon()));
            List<String> images = inforUser.getImages();
            userRepository.save(user);
            for (String image : images) {
                imagesService.addImage(image);
            }
        } else {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }

    }

    @Override
    public void updateAddressUser(String addressLat, String addressLon) {
        Long userId = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            user.setAddressLat(addressLat);
            user.setAddressLon(addressLon);
            user.setLocation(osmService.getLocationName(addressLat, addressLon));
            userRepository.save(user);
        } else {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        Long userId = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }
        Users user = userOptional.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new AppException(ErrorException.INVALID_OLD_PASSWORD);
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new AppException(ErrorException.NEW_PASSWORD_SAME_AS_OLD);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public Boolean checkUser() {
        Long userID = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userID);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            if(user.getEmail() != null && !user.getEmail().isEmpty()) {
                return true;
            }
            return false;
        }
        return false;
    }

    @Override
    @Transactional
    public void updateUser(UserUpdate userUpdate) {
        Long userID = utilsService.getUserIdFromToken();
        Optional<Users> optional = userRepository.findById(userID);
        if (optional.isPresent()) {
            Users user = optional.get();
            user.setFullName(userUpdate.getFullName());
            user.setEmail(userUpdate.getEmail());
            user.setTall(userUpdate.getTall());
            user.setSchool(userUpdate.getSchool());
            user.setCompany(userUpdate.getCompany());
            user.setBio(userUpdate.getBio());
            userRepository.save(user);
        }
    }

//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        return (UserDetails) userRepository.findByUsername(username);
//    }

    private List<UserMatchResult> findAllExcept(Long userId, List<Integer> interestedIn, String lat, String lon, double range, Set<Long> idexisted, Integer minAge, Integer maxAge) {

        StringBuilder sqlBuilder = new StringBuilder("""
            SELECT id as userId, full_name as fullName, YEAR(CURDATE()) - YEAR(birthday) as age, location,
                   ST_Distance_Sphere(POINT(address_lon, address_lat), POINT(:lon, :lat)) AS distanceKm, tall, school, company, bio 
            FROM user
            WHERE ST_Distance_Sphere(POINT(address_lon, address_lat), POINT(:lon, :lat)) < :range
              AND id <> :userId 
              AND gender IN (:interestedIn) 
              AND YEAR(CURDATE()) - year(birthday) >= :minAge
              AND YEAR(CURDATE()) - year(birthday) <= :maxAge
        """);
        if (idexisted != null && !idexisted.isEmpty()) {
            sqlBuilder.append(" AND id NOT IN (:idexisted)");
        }
        sqlBuilder.append(" ORDER BY distanceKm");
        Query query = entityManager.createNativeQuery(sqlBuilder.toString(), "UserMatchMapping");
        query.setParameter("userId", userId);
        query.setParameter("interestedIn", interestedIn);
        query.setParameter("lat", lat);
        query.setParameter("lon", lon);
        query.setParameter("range", range);
        query.setParameter("minAge", minAge);
        query.setParameter("maxAge", maxAge);
        if (idexisted != null && !idexisted.isEmpty()) {
            query.setParameter("idexisted", idexisted);
        }

        return query.getResultList();
    }

    @Override
    public List<UserMatchResult> findMatches() {
        Long userID = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userID);
        if (userOptional.isEmpty()) {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }
        Users currentUser = userOptional.get();
        List<Likes> likes = likeRepository.findAllByFromUser(currentUser);
        List<Long> idsLike = new ArrayList<>();
        likes.forEach(i -> idsLike.add(i.getToUser().getId()));
        List<Matches> matches = matchRepository.findAllByUser1OrUser2(currentUser, currentUser);
        List<Long> idsMatch = new ArrayList<>();
        matches.forEach(m -> {
            if (Objects.equals(m.getUser1().getId(), currentUser.getId())) {
                idsMatch.add(m.getUser2().getId());
            } else if (Objects.equals(m.getUser2().getId(), currentUser.getId())) {
                idsMatch.add(m.getUser1().getId());
            }
        });
        Set<Long> idexisted = new HashSet<>();
        idexisted.addAll(idsLike);
        idexisted.addAll(idsMatch);
        // lấy ra danh sách user match dựa trên khoảng cách
        List<Integer> interestedIn = new ArrayList<>();
        if (currentUser.getInterestedIn() == 0) {
            interestedIn.add(1);
            interestedIn.add(2);
        } else {
            interestedIn.add(currentUser.getInterestedIn());
        }
        List<UserMatchResult> allUsers = this.findAllExcept(userID, interestedIn,
                currentUser.getAddressLat(), currentUser.getAddressLon(), currentUser.getDistanceRange() * 1000,
                idexisted, currentUser.getMinAge(), currentUser.getMaxAge());
        List<Long> userIds = allUsers.stream()
                .map(UserMatchResult::getUserId)
                .toList();
        List<Users> matchedUsers = userRepository.findAllById(userIds);
        //Map vào để tối ưu
        Map<Long, Users> userMap = matchedUsers.stream()
                .collect(Collectors.toMap(Users::getId, u -> u));
        List<UserMatchResult> results = new ArrayList<>();
        //lấy sở thic của từng user để so sánh tỉ lệ match
        for(UserMatchResult matchResult : allUsers) {
            Users other = userMap.get(matchResult.getUserId());
            List<Interests> common = new ArrayList<>(currentUser.getInterests());
            common.retainAll(other.getInterests());
            double interestScore = (double) common.size() /
                    (currentUser.getInterests().size() + other.getInterests().size() - common.size());
            double distanceScore = 1 - (matchResult.getDistanceKm() / (currentUser.getDistanceRange() * 100));
            double finalScore = (WEIGHT_SCORE * interestScore) + (DISTANCE_SCORE * distanceScore);
            matchResult.setFinalScore(finalScore);
            matchResult.setDistanceKm(Math.ceil(distanceScore / 1000));
            matchResult.setImagesList(
                    other.getImages().stream()
                            .map(Images::getUrl)
                            .toList()
            );
            matchResult.setInterestsList(
                    other.getInterests().stream()
                            .map(Interests::getName)
                            .toList()
            );
            results.add(matchResult);
        }
        results.sort((a, b) -> Double.compare(b.getFinalScore(), a.getFinalScore()));
        return results;
    }

    @Override
    public UserSettingResponse getUserSetting() {
        Long userID = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userID);
        if (userOptional.isEmpty()) {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }
        Users currentUser = userOptional.get();
        UserSettingResponse response = new UserSettingResponse();
        response.setLocation(currentUser.getLocation());
        response.setDistanceRange(currentUser.getDistanceRange());
        response.setMinAge(currentUser.getMinAge());
        response.setMaxAge(currentUser.getMaxAge());
        return response;
    }

    @Override
    public UserSettingResponse updateUserSetting(UserSettingResponse update) {
        Long userID = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userID);
        if (userOptional.isEmpty()) {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }
        Users currentUser = userOptional.get();
        if (update.getLocation() != null) {
            currentUser.setLocation(update.getLocation());
        }
        if (update.getDistanceRange() != null) {
            currentUser.setDistanceRange(update.getDistanceRange());
        }
        if (update.getMinAge() != null) {
            currentUser.setMinAge(update.getMinAge());
        }
        if (update.getMaxAge() != null) {
            currentUser.setMaxAge(update.getMaxAge());
        }
//        userSettingMapper.updateUserFromSetting(update, currentUser);
        userRepository.save(currentUser);
        return update;
    }

    public List<UserMatchResult> findAllUserLike() {
        Long userID = utilsService.getUserIdFromToken();
        Users currentUser = userRepository.findById(userID)
                .orElseThrow(() -> new AppException(ErrorException.USER_NOT_EXIST));

        // Lấy danh sách người đã like mình
        List<Likes> likes = likeRepository.findAllByToUserAndStatus(currentUser, StatusName.LIKE);

        //  Map ra danh sách user đã like mình
        List<Users> userLikeList = likes.stream()
                .map(Likes::getFromUser)
                .filter(Objects::nonNull)
                .toList();

        if (userLikeList.isEmpty()) {
            return Collections.emptyList();
        }

        // Duyệt từng user và map thành UserMatchResult
        return userLikeList.stream().map(user -> {
            UserMatchResult dto = new UserMatchResult();
            dto.setUserId(user.getId());
            dto.setFullName(user.getFullName());
            dto.setAge(calculateAge(user.getBirthday()));
            dto.setLocation(osmService.getLocationName(
                    String.valueOf(user.getAddressLat()),
                    String.valueOf(user.getAddressLon())
            ));

            // Tính khoảng cách thực tế bằng GraphHopper (km)
            double distanceKm = osmService.calculateDistanceByOSM(
                    currentUser.getAddressLat(),
                    currentUser.getAddressLon(),
                    user.getAddressLat(),
                    user.getAddressLon()
            );
            dto.setDistanceKm(distanceKm);

            dto.setTall(user.getTall());
            dto.setSchool(user.getSchool());
            dto.setCompany(user.getCompany());
            dto.setBio(user.getBio());
            dto.setImagesList(
                    user.getImages() != null
                            ? user.getImages().stream().map(Images::getUrl).toList()
                            : List.of()
            );
            dto.setInterestsList(
                    user.getInterests() != null
                            ? user.getInterests().stream().map(Interests::getName).toList()
                            : List.of()
            );
            dto.setFinalScore(0.0);
            return dto;
        }).toList();
    }

    @Override
    public ProfileResponse getProfile() {
        Long userId = utilsService.getUserIdFromToken();
        Users currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorException.USER_NOT_EXIST));
        ProfileResponse response = new ProfileResponse();
        response.setUsername(currentUser.getUsername());
        response.setFullName(currentUser.getFullName());
        response.setBirthday(currentUser.getBirthday());
        response.setGender(currentUser.getGender());
        response.setEmail(currentUser.getEmail());
        response.setBio(currentUser.getBio());
        response.setTall(currentUser.getTall());
        response.setSchool(currentUser.getSchool());
        response.setCompany(currentUser.getCompany());
        response.setImages(currentUser.getImages().stream().map(Images::getUrl).toList());
        return response;
    }

    @Override
    public List<UserManagement> getUsersManagement() {
        List<Users> usersList = userRepository.findAllByRole(RoleName.ROLE_USER);
        List<UserManagement> res = new ArrayList<>();
        usersList.forEach(i -> {
            UserManagement userManagement = new UserManagement();
            userManagement.setUsername(i.getUsername());
            userManagement.setFullName(i.getFullName());
            userManagement.setBirthday(i.getBirthday());
            userManagement.setGender(i.getGender());
            userManagement.setEmail(i.getEmail());
            userManagement.setLocation(i.getLocation());
            res.add(userManagement);
        });
        return res;
    }

    @Override
    public InforDashBoard getInforDashBoard() {
        InforDashBoard inforDashBoard = new InforDashBoard();
        inforDashBoard.setTotalUserCount(userRepository.findAllByRole(RoleName.ROLE_USER).size());
        inforDashBoard.setTotalMatchesCount(matchRepository.findAll().size());
        inforDashBoard.setTotalMessageCount(messageRepository.findAll().size());
        return inforDashBoard;
    }

    private int calculateAge(LocalDate birthday) {
        return Period.between(birthday, LocalDate.now()).getYears();
    }

    public void forgotPassword(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorException.USER_NOT_EXIST));

        if (!user.getEmail().equalsIgnoreCase(email)) {
            throw new AppException(ErrorException.EMAIL_NOT_TRUE);
        }
        String tempPassword = generateSecurePassword(12);

        String encoded = passwordEncoder.encode(tempPassword);
        user.setPassword(encoded);
//        user.setForceChangePassword(true);
//        user.setTempPasswordExpiry(Instant.now().plus(tempPasswordExpiryHours, ChronoUnit.HOURS));

        userRepository.save(user);

        sendTempPasswordEmail(user.getEmail(), user.getFullName(), tempPassword);
    }
    private void sendTempPasswordEmail(String toEmail, String fullName, String tempPassword) {
        String subject = "Mật khẩu tạm thời cho tài khoản của bạn";
        String text = "Xin chào " + (fullName == null ? "" : fullName) + ",\n\n"
                + "Bạn (hoặc ai đó) đã yêu cầu khôi phục mật khẩu. Dưới đây là mật khẩu tạm thời của bạn:\n\n"
                + "Mật khẩu tạm thời: " + tempPassword + "\n\n"
                + "Lưu ý:\n"
                + "- Mật khẩu này sẽ hết hạn sau " + tempPasswordExpiryHours + " giờ.\n"
                + "- Khi đăng nhập bằng mật khẩu này, bạn sẽ được yêu cầu đổi mật khẩu mới.\n\n"
                + "Nếu bạn không yêu cầu khôi phục mật khẩu, hãy bỏ qua email này hoặc liên hệ hỗ trợ.\n\n"
                + "Trân trọng,\n"
                + "Team của bạn";

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject(subject);
        msg.setText(text);
        // optional: msg.setFrom("no-reply@yourdomain.com");
        mailSender.send(msg);
    }
    public boolean createTempPasswordAndSend(String email) {
        Optional<Users> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty()) {
            return false;
        }

        Users user = optUser.get();

        // 1) tạo mật khẩu tạm thời an toàn
        String tempPassword = generateSecurePassword(12);

        // 2) mã hóa và lưu vào DB
        String encoded = passwordEncoder.encode(tempPassword);
        user.setPassword(encoded);

//        // 3) mark user phải đổi mật khẩu khi đăng nhập
//        user.setForceChangePassword(true);
//
//        // 4) set thời hạn mật khẩu tạm
//        user.setTempPasswordExpiry(Instant.now().plus(tempPasswordExpiryHours, ChronoUnit.HOURS));

        userRepository.save(user);

        // 5) gửi email (plain-text tempPassword) — nếu bạn dùng HTML email, thay SimpleMailMessage bằng MimeMessage
        sendTempPasswordEmail(user.getEmail(), user.getFullName(), tempPassword);

        return true;
    }
    private String generateSecurePassword(int length) {
        if (length < 8) length = 8;

        final String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String lower = "abcdefghijklmnopqrstuvwxyz";
        final String digits = "0123456789";
        final String specials = "!@#$%&*()-_=+[]{};:,.<>?";

        final String all = upper + lower + digits + specials;

        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        sb.append(upper.charAt(random.nextInt(upper.length())));
        sb.append(lower.charAt(random.nextInt(lower.length())));
        sb.append(digits.charAt(random.nextInt(digits.length())));
        sb.append(specials.charAt(random.nextInt(specials.length())));

        for (int i = 4; i < length; i++) {
            sb.append(all.charAt(random.nextInt(all.length())));
        }
        return shuffleString(sb.toString(), random);
    }

    private String shuffleString(String input, SecureRandom rnd) {
        char[] a = input.toCharArray();
        for (int i = a.length - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            char tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return new String(a);
    }
}
