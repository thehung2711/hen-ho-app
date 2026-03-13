package com.tinder.tinder.model;

import com.tinder.tinder.dto.response.UserMatchResult;
import com.tinder.tinder.enums.RoleName;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@SqlResultSetMapping(
        name = "UserMatchMapping",
        classes = @ConstructorResult(
                targetClass = UserMatchResult.class,
                columns = {
                        @ColumnResult(name = "userId", type = Long.class),
                        @ColumnResult(name = "fullName", type = String.class),
                        @ColumnResult(name = "age", type = Integer.class),
                        @ColumnResult(name = "location", type = String.class),
                        @ColumnResult(name = "distanceKm", type = Double.class),
                        @ColumnResult(name = "tall", type = Double.class),
                        @ColumnResult(name = "school", type = String.class),
                        @ColumnResult(name = "company", type = String.class),
                        @ColumnResult(name = "bio", type = String.class)
                }
        )
)
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    private String fullName;

    private String email;

    private String addressLon;

    private String addressLat;

    private Integer gender;

    private Integer interestedIn;

    private LocalDate birthday;

    private String location;

    private String school;

    private Double tall;

    private String company;

    private String bio;

    private Double distanceRange;

    private Integer minAge;

    private Integer maxAge;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleName role;

    @OneToMany(mappedBy = "users")
    private List<Images> images = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private List<Interests> interests = new ArrayList<>();

//    @Column(name = "force_change_password")
//    private boolean forceChangePassword = false;
//
//    @Column(name = "temp_password_expiry")
//    private Instant tempPasswordExpiry;
}
