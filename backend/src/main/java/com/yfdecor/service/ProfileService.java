
package com.yfdecor.service;

import com.yfdecor.dto.request.ProfileUpdateRequest;
import com.yfdecor.dto.response.ProfileResponse;
import com.yfdecor.model.Profile;
import com.yfdecor.model.User;
import com.yfdecor.repository.ProfileRepository;
import com.yfdecor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {

	private final ProfileRepository profileRepository;
	private final UserRepository userRepository;

	public ProfileResponse getProfile(User user) {
		Profile profile = profileRepository.findByUser(user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
		return toResponse(user, profile);
	}

	public ProfileResponse updateProfile(User user, ProfileUpdateRequest request) {
		Profile profile = profileRepository.findByUser(user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
		user.setName(request.getName());
		profile.setPhone(request.getPhone());
		profile.setGender(request.getGender());
		profile.setAvatarUrl(request.getAvatarUrl());
		profile.setAddress(request.getAddress());
		profile.setCity(request.getCity());
		profile.setState(request.getState());
		profile.setCountry(request.getCountry());
		profile.setZipCode(request.getZipCode());
		userRepository.save(user);
		profileRepository.save(profile);
		return toResponse(user, profile);
	}

	private ProfileResponse toResponse(User user, Profile profile) {
		return ProfileResponse.builder()
				.id(profile.getId())
				.email(user.getEmail())
				.name(user.getName())
				.phone(profile.getPhone())
				.gender(profile.getGender())
				.avatarUrl(profile.getAvatarUrl())
				.address(profile.getAddress())
				.city(profile.getCity())
				.state(profile.getState())
				.country(profile.getCountry())
				.zipCode(profile.getZipCode())
				.build();
	}
}
