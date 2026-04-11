import { Component, inject } from '@angular/core';
import { Healthcare } from '../../../../Core/Services/HealthCare/healthcare';
import { Router } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchPipe } from '../../../../Shared/Pipes/search-pipe';

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

  baseUrl = 'https://gnwbazaar-002-site2.qtempurl.com/';

  searchTerm: string = '';

  doctors: any[] = [];
  categories: any[] = [];
  loading = false;

  showCreatePopup = false;
  showErrorPopup = false;
  showDropdown = false;

  backendErrorMessage = '';

  isEditMode = false;
  editingDoctorId: number | null = null;

  doctorForm: any = {
    DoctorName: '',
    HealthCareCategoryIds: [],
    AboutDoctor: '',
    Phonenumber: '',
    WhatsAppNumber: '',
    Address: '',
    Location: '',
    EndDate: '',
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

          this.doctors.sort(
            (a: any, b: any) =>
              new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime()
          );
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

get filteredDoctors() {
  if (!this.searchTerm || !this.searchTerm.trim()) {
    return this.doctors;
  }

  const term = this.searchTerm.toLowerCase();

  return this.doctors.filter(doc => {
    const name = (doc.DoctorName || '').toLowerCase();
    const phone = (doc.Phonenumber || '').toLowerCase();
    const whatsapp = (doc.WhatsAppNumber || '').toLowerCase();
    const address = (doc.Address || '').toLowerCase();
    const location = (doc.Location || '').toLowerCase();
    const about = (doc.AboutDoctor || '').toLowerCase();
    const categories = this.getCategoryNames(doc).toLowerCase();

    return name.includes(term) || 
           phone.includes(term) || 
           whatsapp.includes(term) || 
           address.includes(term) || 
           location.includes(term) || 
           about.includes(term) || 
           categories.includes(term);
  });
}

  getCategoryNames(doctor: any): string {
    const ids = doctor.HealthCareCategoryIds;

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !this.categories || this.categories.length === 0) {
      return 'N/A';
    }

    const names = this.categories
      .filter(cat => {
        const catId = cat.Id !== undefined ? cat.Id : cat.id;
        return ids.includes(catId);
      })
      .map(cat => {
        return cat.Category || cat.category || 'Unknown';
      });

    return names.length > 0 ? names.join(', ') : 'N/A';
  }

  goToCreateDoctor() {
    this.isEditMode = false;
    this.editingDoctorId = null;
    this.resetForm();
    this.showCreatePopup = true;
  }

  openUpdatePopup(doctor: any) {
    this.isEditMode = true;
    this.editingDoctorId = doctor.Id || doctor.DoctorId; // Use your backend's specific ID property name

    this.doctorForm = {
      DoctorName: doctor.DoctorName,
      HealthCareCategoryIds: [...(doctor.HealthCareCategoryIds || [])], 
      AboutDoctor: doctor.AboutDoctor,
      Phonenumber: doctor.Phonenumber,
      WhatsAppNumber: doctor.WhatsAppNumber,
      Address: doctor.Address,
      Location: doctor.Location,
      EndDate: formatDate(doctor.EndDate, 'yyyy-MM-dd', 'en'),
      IsActive: doctor.IsActive
    };

    this.doctorImageFile = null as any;
    this.clinicImageFile = null as any;

    this.showCreatePopup = true;
  }

  onDoctorImageChange(event: any) {
    this.doctorImageFile = event.target.files[0];
  }

  onClinicImageChange(event: any) {
    this.clinicImageFile = event.target.files[0];
  }

  clearDoctorImage(input: HTMLInputElement) {
    this.doctorImageFile = null as any;
    input.value = '';
  }

  clearClinicImage(input: HTMLInputElement) {
    this.clinicImageFile = null as any;
    input.value = '';
  }

  openImageNewTab(path: string) {
    if (!path) return;

    const url = this.getImageUrl(path);

    if (url) {
      window.open(url, '_blank');
    }
  }

  getImageUrl(Path: string | null | undefined): string {
    if (!Path) return '';

  let normalized = Path.replace(/\\/g, '/');

  let folderIndex = normalized.indexOf('DoctorImage');
  if (folderIndex === -1) {
    folderIndex = normalized.indexOf('ClinicImage');
  }

  if (folderIndex === -1) return '';

  const cleanPath = normalized.substring(folderIndex);

  const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
  return `${base}${cleanPath}`;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  isCategorySelected(id: number): boolean {
    return this.doctorForm.HealthCareCategoryIds.includes(id);
  }

  toggleCategory(id: number) {
    const index = this.doctorForm.HealthCareCategoryIds.indexOf(id);
    if (index > -1) {
      this.doctorForm.HealthCareCategoryIds.splice(index, 1);
    } else {
      this.doctorForm.HealthCareCategoryIds.push(id);
    }
  }

  getSelectedCategoryNames(): string {
    if (!this.doctorForm.HealthCareCategoryIds?.length) return '';

    return this.categories
      .filter(c => this.doctorForm.HealthCareCategoryIds.includes(c.Id))
      .map(c => c.Category)
      .join(', ');
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

    if (this.isEditMode && this.editingDoctorId) {
        formData.append('Id', this.editingDoctorId.toString());
    }
    formData.append('IsActive', this.doctorForm.IsActive.toString());
    
    formData.append('DoctorName', this.doctorForm.DoctorName);
    
    this.doctorForm.HealthCareCategoryIds.forEach((id: any) => {
      formData.append('HealthCareCategoryIds', id);
    });
    formData.append('AboutDoctor', this.doctorForm.AboutDoctor);
    formData.append('Phonenumber', this.doctorForm.Phonenumber);
    formData.append('WhatsAppNumber', this.doctorForm.WhatsAppNumber);
    formData.append('Address', this.doctorForm.Address);
    formData.append('Location', this.doctorForm.Location);
    formData.append('EndDate', this.doctorForm.EndDate);

    if (this.doctorImageFile) {
      formData.append('DoctorImage', this.doctorImageFile);
    }
    if (this.clinicImageFile) {
      formData.append('ClinicImage', this.clinicImageFile);
    }

    // --- NEW: Branch Logic between Update and Create ---
    const requestObservable = this.isEditMode 
      ? this.healthcare.updateDoctor(formData) 
      : this.healthcare.createDoctor(formData);

    requestObservable.subscribe({
      next: (res) => {
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

  resetForm() {
    this.doctorForm = {
      DoctorName: '',
      HealthCareCategoryIds: [],
      AboutDoctor: '',
      Phonenumber: '',
      WhatsAppNumber: '',
      Address: '',
      Location: '',
      EndDatte: '',
      IsActive: true
    };
    this.doctorImageFile = null as any;
    this.clinicImageFile = null as any;
  }

  closePopup() {
    this.showCreatePopup = false;
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }
}