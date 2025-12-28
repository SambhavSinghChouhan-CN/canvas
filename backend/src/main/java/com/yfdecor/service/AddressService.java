
package com.yfdecor.service;

import com.yfdecor.dto.request.AddressRequest;
import com.yfdecor.dto.response.AddressResponse;
import com.yfdecor.model.Address;
import com.yfdecor.model.User;
import com.yfdecor.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

	private final AddressRepository addressRepository;

	public List<AddressResponse> getAddresses(User user) {
		return addressRepository.findByUser(user).stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	public AddressResponse addAddress(User user, AddressRequest request) {
		Address address = Address.builder()
				.user(user)
				.name(request.getName())
				.phone(request.getPhone())
				.addressLine1(request.getAddressLine1())
				.addressLine2(request.getAddressLine2())
				.city(request.getCity())
				.state(request.getState())
				.country(request.getCountry())
				.zipCode(request.getZipCode())
				.isDefault(request.getIsDefault())
				.build();
		Address saved = addressRepository.save(address);
		return toResponse(saved);
	}

	public AddressResponse updateAddress(User user, Long id, AddressRequest request) {
		Address address = addressRepository.findByIdAndUser(id, user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
		address.setName(request.getName());
		address.setPhone(request.getPhone());
		address.setAddressLine1(request.getAddressLine1());
		address.setAddressLine2(request.getAddressLine2());
		address.setCity(request.getCity());
		address.setState(request.getState());
		address.setCountry(request.getCountry());
		address.setZipCode(request.getZipCode());
		address.setIsDefault(request.getIsDefault());
		Address saved = addressRepository.save(address);
		return toResponse(saved);
	}

	public void deleteAddress(User user, Long id) {
		addressRepository.deleteByIdAndUser(id, user);
	}

	private AddressResponse toResponse(Address address) {
		return AddressResponse.builder()
				.id(address.getId())
				.name(address.getName())
				.phone(address.getPhone())
				.addressLine1(address.getAddressLine1())
				.addressLine2(address.getAddressLine2())
				.city(address.getCity())
				.state(address.getState())
				.country(address.getCountry())
				.zipCode(address.getZipCode())
				.isDefault(address.getIsDefault())
				.build();
	}
}



