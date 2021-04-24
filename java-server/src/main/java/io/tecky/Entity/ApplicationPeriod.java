package io.tecky.Entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name="application_period")
public class ApplicationPeriod {
    @Id
    @GeneratedValue
    @Column(name="application_period_id")
    private int id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "application_type_id")
    private ApplicationType applicationTypeId;

    @NotNull @ManyToOne @JoinColumn (name = "application_year_id")
    private ApplicationYear applicationYearId;
    @NotNull @ManyToOne @JoinColumn(name="round_id")
    private Round roundId;

    @NotNull @Column(name="start_date")
    private Date startDate;

    @NotNull @Column(name="end_date")
    private Date endDate;

    @NotNull @Column(name="end_deadline")
    private Date endDeadline;

    @NotNull @Column(name="email_template_id")
    private int emailTemplateId;

    @Column(name="created_at")
    private Timestamp createdAt;

    @Column(name="updated_at")
    private Timestamp updatedAt;
}
