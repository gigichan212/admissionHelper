package io.tecky.Entity;


import javax.persistence.*;

@Entity
@Table(name="application_status", uniqueConstraints = @UniqueConstraint(columnNames = "status"))
public class ApplicationStatus {
    @Id
    @GeneratedValue
    @Column(name="application_status_id")
    private int id;
    @Column(length = 255, name = "status")
    private String status;

}
