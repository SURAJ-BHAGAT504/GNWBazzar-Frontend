import { Component, inject } from '@angular/core';
import { Client } from '../../../../Core/Services/Clients/client';
import { Subcategorymaster } from '../../../../Core/Services/SubCategoryMaster/subcategorymaster';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Healthcare } from '../../../../Core/Services/HealthCare/healthcare';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {
  clientService = inject(Client);
  subCategoryService = inject(Subcategorymaster);
  healthCareService = inject(Healthcare);

  baseUrl = 'https://gnwbazaar-002-site2.qtempurl.com';
  searchTerm: string = '';
  selectedCategoryId: number | null = null;
  clients: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  loading: boolean = false;

  showCreatePopup = false;
  showErrorPopup = false;
  showDropdown = false;
  backendErrorMessage = '';

  isEditMode = false;
  editingClientId: number | null = null;

  clientForm: any = {
    ClientName: '',
    Highlights: '',
    PhoneNumber: '',
    WhatsAppNumber: '',
    Address: '',
    Location: '',
    EndDate: '',
    IsActive: true,
    SubCategoryMasterIds: []
  };

  clientImageFile: File | null = null;

  ngOnInit() {
    this.fetchClients();
    this.fetchSubCategories();
    this.fetchCategories();
  }

  fetchCategories() {
    this.healthCareService.getCategoryMasters().subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          this.categories = res?.Value || [];
        }
      }
    });
  }

  get filteredSubCategoriesList() {
    if (!this.selectedCategoryId) return this.subCategories;

    return this.subCategories.filter(s => {
      return s.CategoryMasterId == this.selectedCategoryId;
    });
  }

  trackById(index: number, item: any) {
    return item.Id;
  }

  fetchClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          const data = [...(res?.Value || [])];
          this.clients = data.sort((a, b) =>
            new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime()
          );
        }
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  fetchSubCategories() {
    this.subCategoryService.getSubCategoryMaster().subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          this.subCategories = res?.Value || [];
        }
      }
    });
  }

  get filteredClients() {
    if (!this.searchTerm.trim()) return this.clients;
    const term = this.searchTerm.toLowerCase();
    return this.clients.filter(c =>
      c.ClientName?.toLowerCase().includes(term) ||
      c.PhoneNumber?.toLowerCase().includes(term) ||
      c.Highlights?.toLowerCase().includes(term) ||
      c.WhatsAppNumber?.toLowerCase().includes(term) ||
      c.Address?.toLowerCase().includes(term) ||
      c.Location?.toLowerCase().includes(term) ||
      c.SubCategoryNames?.some((sc: string) => sc.toLowerCase().includes(term)) ||
      new Date(c.EndDate).toLocaleDateString().includes(term)
    )
  }

  getSubCategoryNames(client: any): string {
    const ids = client.SubCategoryMasterIds || [];
    return this.subCategories
      .filter(s => ids.includes(s.Id))
      .map(s => s.CategoryName)
      .join(', ') || 'N/A';
  }

  openCreatePopup() {
    this.isEditMode = false;
    this.editingClientId = null;
    this.resetForm();
    this.showCreatePopup = true;
  }

  onCategoryChange() {
    if (!this.selectedCategoryId) return;

    const validIds = this.subCategories
      .filter(s => +s.CategoryMasterId === +this.selectedCategoryId!)
      .map(s => +s.Id);

    this.clientForm.SubCategoryMasterIds =
      this.clientForm.SubCategoryMasterIds.filter(
        (id: any) => validIds.includes(+id)
      );
  }

  openUpdatePopup(client: any) {
    this.isEditMode = true;
    this.editingClientId = client.Id;
    this.clientForm = {
      ClientName: client.ClientName,
      Highlights: client.Highlights,
      PhoneNumber: client.PhoneNumber,
      WhatsAppNumber: client.WhatsAppNumber,
      Address: client.Address,
      Location: client.Location,
      EndDate: formatDate(client.EndDate, 'yyyy-MM-dd', 'en'),
      IsActive: client.IsActive,
      SubCategoryMasterIds: [...(client.SubCategoryMasterIds || [])]
    };
    this.showCreatePopup = true;
  }

  onFileChange(event: any) {
    this.clientImageFile = event.target.files[0];
  }

  clearImage(input: HTMLInputElement) {
    this.clientImageFile = null;
    input.value = '';
  }

  saveClient(form: NgForm) {
    if (form.invalid) return;

    const formData = new FormData();

    if (this.isEditMode && this.editingClientId) {
      formData.append('Id', this.editingClientId.toString());
    }

    formData.append('ClientName', this.clientForm.ClientName);
    formData.append('Highlights', this.clientForm.Highlights);
    formData.append('PhoneNumber', this.clientForm.PhoneNumber);
    formData.append('WhatsAppNumber', this.clientForm.WhatsAppNumber);
    formData.append('Address', this.clientForm.Address);
    formData.append('Location', this.clientForm.Location);
    formData.append('EndDate', this.clientForm.EndDate);
    formData.append('IsActive', this.clientForm.IsActive.toString());

    this.clientForm.SubCategoryMasterIds.forEach((id: any) => {
      formData.append('SubCategoryMasterIds', id);
    });

    if (this.clientImageFile) {
      formData.append('ClientImage', this.clientImageFile);
    }

    const request = this.isEditMode
      ? this.clientService.updateClient(formData)
      : this.clientService.createClient(formData);

    request.subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          this.closePopup();
          this.fetchClients();
        } else {
          this.backendErrorMessage = res?.Message || "Operation failed";
          this.showErrorPopup = true;
        }
      },
      error: () => {
        this.backendErrorMessage = "Server error occurred";
        this.showErrorPopup = true;
      }
    });
  }

  // Helper methods for multi-select
  toggleDropdown() { this.showDropdown = !this.showDropdown; }

  isSubSelected(id: number) {
    return this.clientForm.SubCategoryMasterIds &&
      this.clientForm.SubCategoryMasterIds.includes(id);
  }

  toggleSubCategory(id: number) {
    const ids = this.clientForm.SubCategoryMasterIds;
    const index = ids.findIndex((x: any) => +x === +id);

    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(id);
    }
  }

  getSelectedSubNames() {
    if (!this.subCategories || !this.clientForm.SubCategoryMasterIds) return '';

    return this.subCategories
      .filter(s => this.isSubSelected(s.Id))
      .map(s => s.CategoryName)
      .join(', ');
  }

  getImageUrl(Path: string | null | undefined): string {
    if (!Path) return 'https://cdn-icons-png.flaticon.com/512/387/387561.png';
    let normalized = Path.replace(/\\/g, '/');
    let folderIndex = normalized.indexOf('ClientImage');
    if (folderIndex === -1) return Path;
    const cleanPath = normalized.substring(folderIndex);
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    return `${base}${cleanPath}`;
  }

  openImageNewTab(path: string) { window.open(this.getImageUrl(path), '_blank'); }

  closePopup() {
    this.showCreatePopup = false;
    this.selectedCategoryId = null;
  }

  resetForm() {
    this.selectedCategoryId = null;
    this.clientForm = { ClientName: '', Highlights: '', PhoneNumber: '', WhatsAppNumber: '', Address: '', Location: '', EndDate: '', IsActive: true, SubCategoryMasterIds: [] };
    this.clientImageFile = null;
  }
}
