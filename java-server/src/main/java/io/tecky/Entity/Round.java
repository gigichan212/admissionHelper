package io.tecky.Entity;


import javax.persistence.*;

@Entity
@Table(name = "round")
public class Round {
    @Id
    @GeneratedValue
    @Column(name="round_id")
    private int id;
    @Column(length = 255 ,name="round")
    private String round;
}
