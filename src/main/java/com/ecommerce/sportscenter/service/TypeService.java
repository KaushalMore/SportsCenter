package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Type;
import com.ecommerce.sportscenter.model.TypeResponse;

import java.util.List;

public interface TypeService {
    List<TypeResponse> getAllTypes();

    Type findById(Integer typeId);

    Type addType(String name);

    Type findByName(String typeId);

}
