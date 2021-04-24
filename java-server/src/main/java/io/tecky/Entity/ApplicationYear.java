package io.tecky.Entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Table(name="application_year", uniqueConstraints = @UniqueConstraint(columnNames = "year"))
public class ApplicationYear {
    @Id
    @GeneratedValue
    @Column(name="application_year_id")
    private int id;
    @NotNull
    @Column(name="year")
    private int year;
    @Column(name="created_at")
    private Timestamp createdAt;
    @Column(name="updated_at")
    private Timestamp updatedAt;
}
