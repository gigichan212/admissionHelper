package io.tecky.Entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(name = "application_level", uniqueConstraints = @UniqueConstraint(columnNames = "level"))
public class ApplicationLevel {
    @Id
    @GeneratedValue
    @Column(name="application_level_id")
    private int id;
    @NotNull
    @Column(name="level")
    private int level;
}
