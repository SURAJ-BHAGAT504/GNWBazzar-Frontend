import { Component, inject } from '@angular/core';
import { Healthcare } from '../../../../Core/Services/healthcare';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor.html',
  styleUrl: './doctor.css',
})
export class Doctor {

  healthcare = inject(Healthcare);
  router = inject(Router);

  doctors: any[] = [];
  categories: any[] = [];
  loading = false;

  showCreatePopup = false;
  showErrorPopup = false;

  backendErrorMessage = '';

  doctorForm: any = {
    DoctorName: '',
    HealthCareSubCategoryId: '',
    Qualification: '',
    AboutDoctor: '',
    Experience: null,
    Phonenumber: '',
    Email: '',
    Address: '',
    location: '',
    IsActive: true
  };

  doctorImageFile!: File;
  clinicImageFile!: File;

  ngOnInit() {
    this.fetchDoctors();
    this.fetchCategories();
  }

  fetchDoctors() {
    this.loading = true;

    this.healthcare.getDoctors().subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          this.doctors = res?.Value || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  fetchCategories() {
    this.healthcare.getHealthCareCategories().subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          this.categories = res?.Value || [];
        }
      }
    });
  }

  getCategoryName(categoryId: number): string {
    if (!this.categories || !categoryId) return '';

    const category = this.categories.find(
      c => c.Id === categoryId
    );

    return category ? category.Category : '';
  }

  goToCreateDoctor() {
    this.showCreatePopup = true;
  }

  onDoctorImageChange(event: any) {
    this.doctorImageFile = event.target.files[0];
  }

  onClinicImageChange(event: any) {
    this.clinicImageFile = event.target.files[0];
  }

  getImageUrl(fullPath: string): string {
    if (!fullPath) return '';

    const index = fullPath.toLowerCase().indexOf('healthcare');

    if (index === -1) return '';

    let relativePath = fullPath.substring(index);

    relativePath = relativePath.replace(/\\/g, '/');

    relativePath = encodeURI(relativePath);

    return `https://win1039.site4now.net/${relativePath}`;
  }

  saveDoctor(form: NgForm) {

    if (form.invalid) {
      this.backendErrorMessage = "Please fill all required fields correctly.";
      this.showErrorPopup = true;
      return;
    }

    if (this.doctorForm.Phonenumber.length > 10) {
      this.backendErrorMessage = "Phone number cannot exceed 10 digits.";
      this.showErrorPopup = true;
      return;
    }

    const formData = new FormData();

    formData.append('DoctorName', this.doctorForm.DoctorName);
    formData.append('HealthCareSubCategoryId', this.doctorForm.HealthCareSubCategoryId);
    formData.append('Qualification', this.doctorForm.Qualification);
    formData.append('AboutDoctor', this.doctorForm.AboutDoctor);
    formData.append('Experience', this.doctorForm.Experience);
    formData.append('Phonenumber', this.doctorForm.Phonenumber);
    formData.append('Email', this.doctorForm.Email);
    formData.append('Address', this.doctorForm.Address);
    formData.append('location', this.doctorForm.location);
    formData.append('IsActive', 'true');

    if (this.doctorImageFile) {
      formData.append('DoctorImage', this.doctorImageFile);
    }

    if (this.clinicImageFile) {
      formData.append('ClinicImage', this.clinicImageFile);
    }

    this.healthcare.createDoctor(formData).subscribe({
      next: (res) => {

        console.log("API Response:", res);

        if (res?.ResponseCode === 200) {
          this.closePopup();
          this.fetchDoctors();
        }
        else {
          this.backendErrorMessage = res?.Message || "Something went wrong!";
          this.showErrorPopup = true;
        }
      },
      error: () => {
        this.backendErrorMessage = "Server error occurred!";
        this.showErrorPopup = true;
      }
    });
  }

  closePopup() {
    this.showCreatePopup = false;
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }
}