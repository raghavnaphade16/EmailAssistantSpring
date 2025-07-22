package com.raghav.user.userms;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
@GetMapping("/getUser/{name}")
    public  UserModel getUser(@PathVariable String name){
    return userService.getUserDetails(name);
    }
}
