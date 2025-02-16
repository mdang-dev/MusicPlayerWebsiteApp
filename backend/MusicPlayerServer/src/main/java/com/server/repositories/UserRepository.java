package com.server.repositories;

import com.server.dao.UserDao;
import com.server.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UserRepository {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    static class UserRepo {

        private int userId;
        private String userName;
        private String name;
        private String email;
        private String password;
        private String avatar;
        private boolean role;
    }
    
    public static List<UserRepo> getAllUsers() {
        List<User> list = new UserDao().findAll();
        List<UserRepository.UserRepo> repo = new ArrayList<>();
        for (User u: list) {
            UserRepo userRepo = new UserRepo();
            userRepo.setUserId(u.getUserId());
            userRepo.setUserName(u.getUserName());
            userRepo.setName(u.getName());
            userRepo.setEmail(u.getEmail());
            userRepo.setPassword(u.getPassword());
            userRepo.setAvatar(u.getAvatar());
            repo.add(userRepo);
        }
        return repo;
    }
    
}
