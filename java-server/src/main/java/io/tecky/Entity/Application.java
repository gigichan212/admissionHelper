package io.tecky.Entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;


@Entity
@Table(name="application")
public class Application {
    @Id
    @GeneratedValue
    @Column(name="application_id")
    private int id;
    @NotNull
    @Column(length = 255 , name="email")
    private String email;
    @NotNull
    @Column(name = "prefix")  // <--what is this?
    private int prefix;
    @NotNull
    @Column(length = 255 , name = "chinese_name")
    private String chineseName; //varchar(255)
    @NotNull
    @Column(length = 255 , name = "english_name")
    private String englishName; //varchar(255)
    @NotNull
    @Column(name="date_of_birth")
    private Date dateOfBirth;
    @NotNull
    @Column(name="place_of_birth")
    private String placeOfBirth;
    @NotNull
    @Column(name="level_id")
    private int levelId;
    @NotNull
    @Column(name="birth_cert_num")
    private String birthCertNum;
    @NotNull
    @Column(name="address")
    private String address; //text
    @NotNull
    @Column(length = 1 , name="sex")
    private String sex; //char(1)??
    @NotNull
    @Column(length = 255 ,name="nationality")
    private String nationality; //varchar(255)
    @Column(length = 255 ,name="religion")
    private String religion; //varchar(255)
    @NotNull
    @Column(name="phone_num")
    private int phone;
    @Column(name="remarks")
    private String remarks;
    @NotNull
    @Column(name="have_sibling")
    private boolean haveSibling;
    @NotNull
    @Column(name="recent_photo")
    private String recentPhoto;
    @Column(name="interview_date")
    private Date interviewDate;
    @Column(name="interview_time")
    private Time interviewTime; //Time?
    @NotNull @ManyToOne @JoinColumn (name = "application_period_id") // <--not sure
    private ApplicationPeriod application_period_id;
    @NotNull @ManyToOne @JoinColumn (name = "application_status_id") // <--not sure
    private ApplicationStatus application_status_id;
    @Column(name="first_round_score")
    private int firstRoundScore;
    @Column(name="first_round_remark")
    private String firstRoundRemark;
    @Column(name="second_round_score")
    private int secondRoundScore;
    @Column(name="second_round_remark")
    private String secondRoundRemark;
    @Column(name="school_remark")
    private String schoolRemark;
    @Column(name="created_at")
    private Timestamp createdAt;
    @Column(name="updated_at")
    private Timestamp updatedAt;
    @ManyToOne @JoinColumn (name = "updated_user_id") // <--not sure
    private Users updatedUserid;
    @Column(name="is_active")
    private Boolean isActive = true;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getPrefix() {
        return prefix;
    }

    public void setPrefix(int prefix) {
        this.prefix = prefix;
    }

    public String getChineseName() {
        return chineseName;
    }

    public void setChineseName(String chineseName) {
        this.chineseName = chineseName;
    }

    public String getEnglishName() {
        return englishName;
    }

    public void setEnglishName(String englishName) {
        this.englishName = englishName;
    }

    public Date getDateOfBirth() { return dateOfBirth; }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPlaceOfBirth() {
        return placeOfBirth;
    }

    public void setPlaceOfBirth(String placeOfBirth) {
        this.placeOfBirth = placeOfBirth;
    }

    public int getLevelId() {
        return levelId;
    }

    public void setLevelId(int levelId) {
        this.levelId = levelId;
    }

    public String getBirthCertNum() {
        return birthCertNum;
    }

    public void setBirthCertNum(String birthCertNum) {
        this.birthCertNum = birthCertNum;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public int getPhone() {
        return phone;
    }

    public void setPhone(int phone) {
        this.phone = phone;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public boolean isHaveSibling() {
        return haveSibling;
    }

    public void setHaveSibling(boolean haveSibling) {
        this.haveSibling = haveSibling;
    }

    public String getRecentPhoto() {
        return recentPhoto;
    }

    public void setRecentPhoto(String recentPhoto) {
        this.recentPhoto = recentPhoto;
    }

    public Date getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(Date interviewDate) {
        this.interviewDate = interviewDate;
    }

    public Time getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(Time interviewTime) {
        this.interviewTime = interviewTime;
    }

    public ApplicationPeriod getApplication_period_id() {
        return application_period_id;
    }

    public void setApplication_period_id(ApplicationPeriod application_period_id) {
        this.application_period_id = application_period_id;
    }

    public ApplicationStatus getApplication_status_id() {
        return application_status_id;
    }

    public void setApplication_status_id(ApplicationStatus application_status_id) {
        this.application_status_id = application_status_id;
    }

    public int getFirstRoundScore() {
        return firstRoundScore;
    }

    public void setFirstRoundScore(int firstRoundScore) {
        this.firstRoundScore = firstRoundScore;
    }

    public String getFirstRoundRemark() {
        return firstRoundRemark;
    }

    public void setFirstRoundRemark(String firstRoundRemark) {
        this.firstRoundRemark = firstRoundRemark;
    }

    public int getSecondRoundScore() {
        return secondRoundScore;
    }

    public void setSecondRoundScore(int secondRoundScore) {
        this.secondRoundScore = secondRoundScore;
    }

    public String getSecondRoundRemark() {
        return secondRoundRemark;
    }

    public void setSecondRoundRemark(String secondRoundRemark) {
        this.secondRoundRemark = secondRoundRemark;
    }

    public String getSchoolRemark() {
        return schoolRemark;
    }

    public void setSchoolRemark(String schoolRemark) {
        this.schoolRemark = schoolRemark;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Users getUpdatedUserid() {
        return updatedUserid;
    }

    public void setUpdatedUserid(Users updatedUserid) {
        this.updatedUserid = updatedUserid;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
