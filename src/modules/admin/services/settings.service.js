import api from "../../../services/api";

class SettingsService {
  async getProfile() {
    return api.get("/admin/profile");
  }
}

export default new SettingsService();
