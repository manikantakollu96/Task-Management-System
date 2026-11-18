
package com.task.employee.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "task_id_counter")
public class TaskIdCounter {

    @Id
    private Long id;

    @Column(name = "last_id", nullable = false)
    private Long lastId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLastId() {
        return lastId;
    }

    public void setLastId(Long lastId) {
        this.lastId = lastId;
    }
}
