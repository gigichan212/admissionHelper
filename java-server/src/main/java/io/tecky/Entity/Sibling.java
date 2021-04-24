package io.tecky.Entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="sibling")
public class Sibling {
    @Id
    @GeneratedValue
    @Column(name = "sibling_id")
    private int id;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application applicationId;
    @NotNull
    @Column(length = 255,name = "name")
    private String name;
    @NotNull
    @Column(length = 1,name = "sex")
    private String sex;
    @NotNull
    @Column(length = 255,name = "school_name")
    private String schoolName;
    @NotNull
    @Column(length = 255,name = "grade")
    private String grade;
    @NotNull
    @Column(name = "is_active")
    private Boolean isActive = true;


}
