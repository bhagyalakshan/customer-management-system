package com.cms.customer.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false, unique = true)
    private String nic;


    @ElementCollection
    @CollectionTable(name = "customer_mobile", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "mobile_number")
    private List<String> mobileNumbers;


    @ElementCollection
    @CollectionTable(name = "customer_address", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "address")
    private List<String> addresses;


    @OneToMany
    @JoinColumn(name = "parent_customer_id")
    private List<Customer> familyMembers;



    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public List<String> getMobileNumbers() {
        return mobileNumbers;
    }

    public void setMobileNumbers(List<String> mobileNumbers) {
        this.mobileNumbers = mobileNumbers;
    }

    public List<String> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<String> addresses) {
        this.addresses = addresses;
    }

    public List<Customer> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<Customer> familyMembers) {
        this.familyMembers = familyMembers;
    }

    public void setId(Long id) {
    }
}