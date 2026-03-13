package com.tinder.tinder.repository;

import com.tinder.tinder.model.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    Optional<Images> findByUrl(String url);
}
