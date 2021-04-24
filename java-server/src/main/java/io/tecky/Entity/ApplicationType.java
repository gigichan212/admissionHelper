package io.tecky.Entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Table(name="application_type" , uniqueConstraints = @UniqueConstraint(columnNames = "type"))
public class ApplicationType {
    @Id
    @GeneratedValue
    @Column(name="application_type_id")
    private int id;
    @NotNull
    @Column(name = "type")
    private String type;
    @NotNull
    @Column(columnDefinition = "text", name = "application_procedure")
    private String applicationProcedure;
    @NotNull
    @Column(columnDefinition = "text", name = "application_note")
    private String applicationNote;
    @NotNull
    @Column(columnDefinition = "text", name = "confirmation_letter")
    private String confirmationLetter;
    @Column(name="created_at")
    private Timestamp createdAt;
    @Column(name="updated_at")
    private Timestamp updatedAt;

}
