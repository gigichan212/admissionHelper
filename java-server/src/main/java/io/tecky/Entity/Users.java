package io.tecky.Entity;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;


@Entity
@Table(name="Users", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class Users {
    @Id @GeneratedValue
    @Column(name="users_id")
    private int id;
    @NotNull @Column(name="username")
    private String username;
    @NotNull @Column(name="password")
    private String password;
    @NotNull @ManyToOne @JoinColumn (name = "user_role_id")
    private UserRole  userRoleId;
    @CreationTimestamp @Column(name="created_at")
    private Timestamp createdAt;
    @CreationTimestamp @Column(name="updated_at")
    private Timestamp updatedAt;
    @Column(name="is_active")
    private Boolean isActive = true;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getUser_role_id() {
        return userRoleId;
    }

    public void setUser_role_id(UserRole user_role_id) {
        this.userRoleId = user_role_id;
    }

    public Timestamp getCreated_at() {
        return createdAt;
    }

    public void setCreated_at(Timestamp created_at) {
        this.createdAt = created_at;
    }

    public Timestamp getUpdated_at() {
        return updatedAt;
    }

    public void setUpdated_at(Timestamp updated_at) {
        this.updatedAt = updated_at;
    }

    public boolean isIs_active() {
        return isActive;
    }

    public void setIs_active(boolean is_active) {
        this.isActive = is_active;
    }
}
