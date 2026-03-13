package com.tinder.tinder.service.impl;

import com.tinder.tinder.dto.response.MatchResponse;

import java.util.List;

public interface IMatchService {
    public List<MatchResponse> getUserMatches();
    public Integer countMatchDontRead();
}
