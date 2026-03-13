package com.tinder.tinder.service;

import com.tinder.tinder.dto.request.InterestCreate;
import com.tinder.tinder.exception.AppException;
import com.tinder.tinder.exception.ErrorException;
import com.tinder.tinder.model.Interests;
import com.tinder.tinder.repository.InterestRepository;
import com.tinder.tinder.service.impl.IInterestService;
import org.springframework.stereotype.Service;

import java.util.Optional;

import java.util.List;

@Service
public class InterestService implements IInterestService {

    private final InterestRepository interestRepository;

    public InterestService(InterestRepository interestRepository) {
        this.interestRepository = interestRepository;
    }

    @Override
    public void addInterest(InterestCreate interestCreate) {
        Interests newInterest = new Interests();
        if(interestCreate.getName() == null || interestCreate.getName().isEmpty()) {
            throw new AppException(ErrorException.INTEREST_NAME_NOT_BLANK);
        }
        Interests exist = interestRepository.getByName(interestCreate.getName());
        if (exist == null) {
            newInterest.setName(interestCreate.getName().trim());
            newInterest.setDescription(interestCreate.getDescription().trim());
            interestRepository.save(newInterest);
        } else {
            throw new AppException(ErrorException.NAME_INTEREST_EXISTS);
        }
    }

    @Override
    public void updateInterest(Long id, InterestCreate request) {
        Interests interest = interestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorException.INTEREST_NOT_EXIST));

        // Validate name
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new AppException(ErrorException.INTEREST_NAME_NOT_BLANK);
        }

        String trimmedName = request.getName().trim();

        // Kiểm tra xem tên mới đã tồn tại trong DB chưa (ngoại trừ chính nó)
        Interests existing = interestRepository.getByName(trimmedName);
        if (existing != null && !existing.getId().equals(id)) {
            throw new AppException(ErrorException.NAME_INTEREST_EXISTS);
        }

        // Cập nhật lại thông tin
        interest.setName(trimmedName);
        interest.setDescription(
                request.getDescription() != null ? request.getDescription().trim() : null
        );

        // Lưu lại
        interestRepository.save(interest);
    }


    @Override
    public List<Interests> getAllInterests() {
        return interestRepository.findAll();
    }
}
