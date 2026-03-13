package com.tinder.tinder.service.impl;

import com.tinder.tinder.dto.request.InterestCreate;
import com.tinder.tinder.model.Interests;

import java.util.List;

public interface IInterestService {
    void addInterest(InterestCreate interestCreate);
    void updateInterest(Long id, InterestCreate request);
    List<Interests> getAllInterests();
}
