package com.raghav.user.userms;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserModel getUserDetails(String name){
   return userRepository.findAll().stream().filter(user -> user.getUserName().equalsIgnoreCase(name)).findFirst().orElse(null);
}
}
