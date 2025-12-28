
package com.yfdecor.repository;

import com.yfdecor.model.Profile;
import com.yfdecor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
	Optional<Profile> findByUser(User user);
}
