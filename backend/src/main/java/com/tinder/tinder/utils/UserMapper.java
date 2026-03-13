package com.tinder.tinder.utils;


import com.tinder.tinder.dto.request.UserUpdate;
import com.tinder.tinder.dto.response.UserManagement;
import com.tinder.tinder.model.Users;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(UserUpdate dto, @MappingTarget Users target);
}