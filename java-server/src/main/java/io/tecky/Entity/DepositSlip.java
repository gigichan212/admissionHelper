package io.tecky.Entity;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Table(name="deposit_slip", uniqueConstraints = @UniqueConstraint(columnNames = "deposit_slip"))
public class DepositSlip {
    @Id
    @GeneratedValue
    @Column(name="deposit_slip_id")
    private int id;
    @NotNull

    @ManyToOne @JoinColumn(name="application_id")
    private Application applicationId;
    @NotNull
    @Column(length = 255, name="deposit_slip")
    private String depositSlip;
    @CreationTimestamp @Column(name="created_at")
    private Timestamp createdAt;
    @CreationTimestamp @Column(name="updated_at")
    private Timestamp updateAt;
}
