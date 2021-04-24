package io.tecky.Service;


import io.tecky.Entity.Users;
import io.tecky.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    @Autowired
    private UsersRepository repository;

    //post Users methods
    public String saveUser(Users user) {
        repository.save(user);
        return "save user success";
    }
}
