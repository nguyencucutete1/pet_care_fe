import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const PET_NAME_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]{2,}$/;
// /^[ A-Za-z0-9À-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ\s]+$/;

const ModalAddPet = (props) => {
  const { open, onClose, handUpdateTable, page } = props;

  const [userId, setUserId] = useState("");
  const [petName, setPetName] = useState("");
  const [category, setCategory] = useState("");
  const [rank, setRank] = useState(0);
  const [status, setStatus] = useState(true);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    console.log(status);
  };

  // --------------------- VALIDATION -----------------------------
  const [valid, setValid] = useState("");
  useEffect(() => {
    setValid(PET_NAME_REGEX.test(petName));
  }, [petName]);

  const handleValidationPetName = (e) => {
    setPetName(e.target.value);
  };

  // --------------------- HANDLE CREATE PET -----------------------------
  const handleCreateService = async () => {
    console.log(userId, petName, category, rank, status);
    if (!valid) {
      toast.error(
        "Tên thú cưng không được nhập số, kí tự đặc biệt và phải có ít nhất 2 kí tự"
      );
    } else {
      try {
        const response = await axios.post("http://localhost:3500/pet", {
          userId,
          petName,
          category,
          rank,
          status,
        });
        if (response.error) {
          toast.error(response.error);
        } else {
          console.log("Thành công!!", response);
          toast.success("Thêm mới thú cưng thành công!");
          setUserId("");
          setPetName("");
          setCategory("");
          setRank();
          setStatus(true);
          handUpdateTable(page);
          onClose();
        }
      } catch (error) {
        console.error(error);
        console.log("Error creating service.");
        if (!error.status) {
          toast.error("Lỗi ");
        } else if (error.status === 500) {
          toast.error("Không được để trống");
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 2,
          borderRadius: "12px",
          boxShadow: 5,
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thêm thú cưng mới
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <form>
            <TextField
              required
              fullWidth
              label="Id chủ thú cưng"
              margin="normal"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              error={userId === ""}
              helperText={userId === "" ? "Không được để trống!" : " "}
            />
            <TextField
              required={true}
              fullWidth
              label="Tên thú cưng"
              margin="normal"
              value={petName}
              onChange={(e) => handleValidationPetName(e)}
              error={!valid}
            />
            <TextField
              required={true}
              fullWidth
              label="Loại thú cưng"
              margin="normal"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <TextField
              required={true}
              fullWidth
              label="Cấp thú cưng ban đầu"
              type="number"
              margin="normal"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              InputProps={{
                readOnly: true,
              }}
              variant="filled"
            />
            <RadioGroup
              value={status}
              onChange={handleStatusChange}
              row
              aria-label="status"
              name="status"
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Hoạt động"
              />
              <FormControlLabel value={false} control={<Radio />} label="Ẩn" />
            </RadioGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            margin="normal"
            color="primary"
            onClick={handleCreateService}
          >
            Thêm thú cưng
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalAddPet;
