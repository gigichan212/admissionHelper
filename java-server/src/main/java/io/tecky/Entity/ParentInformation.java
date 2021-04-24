package io.tecky.Entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="parent_information")
public class ParentInformation {
    @Id
    @GeneratedValue
    @Column(name="parent_information_id")
    private int id;
    @NotNull
    @ManyToOne @JoinColumn(name="application_id")
    private Application applicationId;
    @NotNull
    @Column(length = 255, name="parent_type")
    private String parentType;
    @NotNull
    @Column(length = 255, name="chinese_name")
    private String chineseName;
    @NotNull
    @Column(length = 255, name="english_name")
    private String englishName;
    @NotNull
    @Column(length = 255, name="occupation")
    private String occupation;
    @NotNull
    @Column(columnDefinition = "text", name="office_address")
    private String officeAddress;
    @NotNull
    @Column(name="office_phone")
    private int officePhone;
    @NotNull
    @Column(name="mobile")
    private int mobile;
    @Column(name="is_active")
    private Boolean isActive = true;
}
