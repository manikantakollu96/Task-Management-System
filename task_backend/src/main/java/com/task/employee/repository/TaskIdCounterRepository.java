
package com.task.employee.repository;

import com.task.employee.entity.TaskIdCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TaskIdCounterRepository
        extends JpaRepository<TaskIdCounter, Long> {

    @Query(
        value = "SELECT * FROM task_id_counter WHERE id = :id FOR UPDATE",
        nativeQuery = true
    )
    Optional<TaskIdCounter> findByIdForUpdate(@Param("id") Long id);
}
