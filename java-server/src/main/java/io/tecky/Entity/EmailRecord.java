package io.tecky.Entity;


import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Table(name="email_record")
public class EmailRecord {
    @Id
    @GeneratedValue
    @Column(name="email_record_id")
    private int id;
    @NotNull // <--not sure
    @ManyToOne @JoinColumn(name="application_id")
    private Application applicationId;
    @NotNull
    @Column(name="message_id")
    private int messageId;
    @CreationTimestamp
    @Column(name="submitted_at")
    private Timestamp submittedAt;
    @CreationTimestamp
    @Column(name="created_at")
    private Timestamp createdAt;
    @CreationTimestamp
    @Column(name="updated_at")
    private Timestamp updatedAt;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Application getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Application applicationId) {
        this.applicationId = applicationId;
    }

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public Timestamp getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Timestamp submittedAt) {
        this.submittedAt = submittedAt;
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
}
