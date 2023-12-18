package com.example.api.Service;

import com.example.api.Entity.Tech;
import com.example.api.Repository.TechRepository;
import com.example.api.Service.IService.TechService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TechServiceImpl implements TechService {

    @Autowired
    TechRepository techRepository;

    @Override
    public List<Tech> findAll() {
        return techRepository.findAll();
    }
}
