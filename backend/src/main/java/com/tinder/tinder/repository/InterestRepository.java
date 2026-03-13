package com.tinder.tinder.repository;

import com.tinder.tinder.model.Interests;
import com.tinder.tinder.model.Users;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InterestRepository extends JpaRepository<Interests, Long> {
    @Query(value = "select * from interests where LOWER(trim(name)) = LOWER(trim(:name))", nativeQuery = true)
    Interests getByName(@Param("name") String name);
}
