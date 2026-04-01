import { Component, inject, OnInit } from '@angular/core';
import { SponsorService } from '../../../Core/Services/sponsor-service';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sponsor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sponsor.html',
  styleUrl: './sponsor.css',
})
export class Sponsor implements OnInit {
  sponsorService = inject(SponsorService);

  baseUrl = 'https://gnwbazaar-002-site2.qtempurl.com/';
  searchTerm: string = '';
  sponsors: any[] = [];
  loading = false;

  showCreatePopup = false;
  showErrorPopup = false;
  backendErrorMessage = '';

  isEditMode = false;
  editingSponsorId: number | null = null;

  sponsorForm: any = {
    ClientName: '',
    Description: '',
    PhoneNumber: '',
    Email: '',
    SponsorType: '',
    SponsorProduct: '',
    StartDate: '',
    EndDate: '',
    IsActive: true,
    CreatedBy: 'System'
  };

  sponsorFileToUpload: File | null = null;

  ngOnInit() {
    this.fetchSponsors();
  }

  fetchSponsors() {
    this.loading = true;
    this.sponsorService.getSponsors().subscribe({
      next: (res: any) => {
        if (res?.ResponseCode === 200) {
          this.sponsors = res?.Value || [];
          this.sponsors.sort((a, b) => new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime());
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  get filteredSponsors() {
    if (!this.searchTerm.trim()) return this.sponsors;
    const term = this.searchTerm.toLowerCase();
    return this.sponsors.filter(s =>
      (s.ClientName || '').toLowerCase().includes(term) ||
      (s.SponsorProduct || '').toLowerCase().includes(term) ||
      (s.Email || '').toLowerCase().includes(term) ||
      (s.PhoneNumber || '').toLowerCase().includes(term) ||
      (s.Description || '').toLowerCase().includes(term) ||
      (s.SponsorType || '').toLowerCase().includes(term) ||
      (s.CreatedOn ? formatDate(s.CreatedOn, 'yyyy-MM-dd', 'en').toLowerCase().includes(term) : false) ||
      (s.IsActive !== undefined && (s.IsActive ? 'active' : 'inactive').includes(term))
    );
  }

  onFileChange(event: any) {
    this.sponsorFileToUpload = event.target.files[0];
  }

  openCreatePopup() {
    this.isEditMode = false;
    this.editingSponsorId = null;
    this.resetForm();
    this.showCreatePopup = true;
  }

  openUpdatePopup(sponsor: any) {
    this.isEditMode = true;
    this.editingSponsorId = sponsor.Id;
    this.sponsorForm = {
      ClientName: sponsor.ClientName,
      Description: sponsor.Description,
      PhoneNumber: sponsor.PhoneNumber,
      Email: sponsor.Email,
      SponsorType: sponsor.SponsorType,
      SponsorProduct: sponsor.SponsorProduct,
      StartDate: sponsor.StartDate ? formatDate(sponsor.StartDate, 'yyyy-MM-dd', 'en') : '',
      EndDate: sponsor.EndDate ? formatDate(sponsor.EndDate, 'yyyy-MM-dd', 'en') : '',
      IsActive: sponsor.IsActive,
      CreatedBy: sponsor.CreatedBy || 'Admin'
    };
    this.showCreatePopup = true;
  }

  clearSponsorImage(input: HTMLInputElement) {
    this.sponsorFileToUpload = null;
    input.value = '';
  }

  saveSponsor(form: NgForm) {
    if (form.invalid) return;

    const formData = new FormData();

    if (this.isEditMode && this.editingSponsorId) {
      formData.append('Id', this.editingSponsorId.toString());
    }

    formData.append('ClientName', this.sponsorForm.ClientName);
    formData.append('Description', this.sponsorForm.Description);
    formData.append('PhoneNumber', this.sponsorForm.PhoneNumber);
    formData.append('Email', this.sponsorForm.Email);
    formData.append('SponsorType', this.sponsorForm.SponsorType);
    formData.append('SponsorProduct', this.sponsorForm.SponsorProduct);
    formData.append('StartDate', this.sponsorForm.StartDate);
    formData.append('EndDate', this.sponsorForm.EndDate);
    formData.append('IsActive', this.sponsorForm.IsActive.toString());
    formData.append('CreatedBy', this.sponsorForm.CreatedBy);

    if (this.sponsorFileToUpload) {
      formData.append('SponsorFile', this.sponsorFileToUpload);
    }

    const request = this.isEditMode
      ? this.sponsorService.updateSponsor(formData)
      : this.sponsorService.createSponsor(formData);

    request.subscribe({
      next: (res: any) => {
        if (res?.ResponseCode === 200) {
          this.closePopup();
          this.fetchSponsors();
        } else {
          this.backendErrorMessage = res?.Message || "Operation failed";
          this.showErrorPopup = true;
        }
      },
      error: () => {
        this.backendErrorMessage = "Server error";
        this.showErrorPopup = true;
      }
    });
  }

  openImageNewTab(path: string) {
    if (!path) return;
    const url = this.getImageUrl(path);
    window.open(encodeURI(url), '_blank');
  }

  getImageUrl(Path: string | null | undefined): string {
    if (!Path) return 'https://cdn-icons-png.flaticon.com/512/387/387561.png';
    let normalized = Path.replace(/\\/g, '/');
    let folderIndex = normalized.indexOf('SponsorImage');
    if (folderIndex === -1) return Path;
    const cleanPath = normalized.substring(folderIndex);
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    return `${base}${cleanPath}`;
  }

  resetForm() {
    this.sponsorForm = {
      ClientName: '', Description: '', PhoneNumber: '', Email: '',
      SponsorType: '', SponsorProduct: '', StartDate: '', EndDate: '',
      IsActive: true, CreatedBy: 'Admin'
    };
    this.sponsorFileToUpload = null;
  }

  closePopup() { this.showCreatePopup = false; }
  closeErrorPopup() { this.showErrorPopup = false; }
}