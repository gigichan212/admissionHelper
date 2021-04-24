package io.tecky.Controller;

import io.tecky.Entity.Users;
import io.tecky.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsersController {
    @Autowired
    private UsersService service;

    @PostMapping("/addUser")
    public String addUser(@RequestBody Users user){
        return service.saveUser(user);
    }
}
