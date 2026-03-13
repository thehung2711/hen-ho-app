package com.tinder.tinder.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateUserImagesDTO {
    private List<String> newImages;
    private List<String> deletedImages;

}
