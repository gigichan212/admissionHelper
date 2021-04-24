package io.tecky.Entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="school_history")
public class SchoolHistory {
    @Id
    @GeneratedValue
    @Column(name="school_history_id")
    private int id;
    @NotNull
    @ManyToOne @JoinColumn(name="application_id")
    private Application applicationId;
    @NotNull
    @Column(length = 255 ,name="name")
    private String name;
    @NotNull
    @Column(length = 255 , name="duration")
    private String duration;
    @NotNull
    @Column(length = 255 , name="grade")
    private String grade;
    @NotNull
    @Column(length = 255 , name="conduct_grade")
    private String conductGrade;
    @NotNull
    @Column(name="is_active")
    private Boolean isActive = true;
}
