package io.tecky.Entity;


import javax.persistence.*;

@Entity
@Table(name="user_role")
public class UserRole {
    @Id @GeneratedValue @Column(name="user_role_id")
    private int id;
    @Column(length = 255 ,name="role")
    private String role; //<--what is this?
}
