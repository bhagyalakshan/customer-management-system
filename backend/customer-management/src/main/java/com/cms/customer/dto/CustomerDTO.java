package com.cms.customer.dto;

import java.time.LocalDate;
import java.util.List;

public class CustomerDTO {

    private Long id;
    private String name;
    private LocalDate dob;
    private String nic;

    private List<String> mobileNumbers;
    private List<String> addresses;
    private List<Long> familyMemberIds;

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }

    public List<String> getMobileNumbers() { return mobileNumbers; }
    public void setMobileNumbers(List<String> mobileNumbers) { this.mobileNumbers = mobileNumbers; }

    public List<String> getAddresses() { return addresses; }
    public void setAddresses(List<String> addresses) { this.addresses = addresses; }

    public List<Long> getFamilyMemberIds() { return familyMemberIds; }
    public void setFamilyMemberIds(List<Long> familyMemberIds) { this.familyMemberIds = familyMemberIds; }
}