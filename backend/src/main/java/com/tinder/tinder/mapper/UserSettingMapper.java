package com.tinder.tinder.mapper;

import com.tinder.tinder.dto.response.UserManagement;
import com.tinder.tinder.dto.response.UserSettingResponse;
import com.tinder.tinder.model.Users;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserSettingMapper {
    UserSettingMapper INSTANCE = Mappers.getMapper(UserSettingMapper.class);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromSetting(UserSettingResponse dto, @MappingTarget Users user);
}
