package com.cgdn.cinema.modules.auth.repository;

import com.cgdn.cinema.modules.auth.entity.Account;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Spring Data JPA repository for {@link Account} mapped to {@code nguoi_dung}. */
public interface AccountRepository extends JpaRepository<Account, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.email = :email")
    Optional<Account> findByEmailForUpdate(@Param("email") String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.googleId = :googleId")
    Optional<Account> findByGoogleIdForUpdate(@Param("googleId") String googleId);

    default void revoke(long id) {
        // Placeholder for future token-version revocation
    }
}
