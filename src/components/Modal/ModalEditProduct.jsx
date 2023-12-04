import { useEffect, useState } from "react";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid, Input } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const PRODUCT_NAME_REGEX =
  /^[ A-Za-z0-9À-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ,\s]{3,}$/;
const PRICE_REGEX = /^[1-9]{1}\d{3,}$/;
const QUANTITY_REGEX = /^[0-9]{1,}$/;
const DESCRIPTION_REGEX =
  /^[ A-Za-zÀ-Ỹà-ỹĂ-Ắă-ằẤ-Ứấ-ứÂ-Ấâ-ấĨ-Ỹĩ-ỹĐđÊ-Ểê-ểÔ-Ốô-ốơ-ởƠ-Ớơ-ớƯ-Ứư-ứỲ-Ỵỳ-ỵ0-9\!@#$%^&,.?\s]{1,}$/;

const ModalEditProduct = (props) => {
  const {
    open,
    onClose,
    handUpdateEditTable,
    dataEditProduct,
    category,
    page,
  } = props;
  const currentDate = dayjs();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [saleStartTime, setSaleStartTime] = useState(null);
  const [saleEndTime, setSaleEndTime] = useState(null);
  const [isStartDateVisible, setIsStartDateVisible] = useState(false);

  //   const [status, setStatus] = useState(true);

  //   const handleStatusChange = (event) => {
  //     setStatus(event.target.value);
  //     console.log(status);
  //   };

  // --------------------- HANLDE CHANGE DÍCOUNT -----------------------------
  const handleDiscountChange = (event) => {
    const { value } = event.target;
    const numericValue = parseInt(value, 10);
    setDiscount(value);
    if (numericValue >= 1 && numericValue <= 100) {
      setSaleStartTime();
      setSaleEndTime();
      setIsStartDateVisible(true);
    } else {
      setIsStartDateVisible(false);
    }
  };

  // --------------------- HANLDE CHANGE START DATE -----------------------------
  const handleStartDateChange = (date) => {
    // Chỉ đặt startDate nếu ngày được chọn không phải là ngày trong quá khứ
    if (!dayjs(date).isBefore(dayjs(), "day")) {
      toast.success("Ngày bắt đầu hợp lệ!");
      setSaleStartTime(date);

      // Nếu endDate đã được chọn và trước startDate, đặt lại endDate thành null
      if (saleEndTime && dayjs(saleEndTime).isBefore(date)) {
        toast.error("Ngày bắt đầu không thể sau ngày kết thúc!!");
        setSaleEndTime(null);
      }
    } else {
      toast.error("Ngày bắt đầu không thể ở quá khứ!!");
    }
  };

  const handleEndDateChange = (date) => {
    // Chỉ đặt endDate nếu startDate đã được chọn và ngày được chọn sau saleStartTime
    if (saleStartTime && !dayjs(date).isBefore(saleStartTime)) {
      toast.success("Ngày kết thúc hợp lệ!");
      setSaleEndTime(date);
    } else {
      toast.error("Ngày kết thúc không thể sau ngày bắt đầu!!");
    }
  };

  // --------------------- VALIDATION -----------------------------
  const [validProductName, setValidProductName] = useState("");
  const [validPrice, setValidPrice] = useState("");
  const [validQuantity, setValidQuantity] = useState("");
  const [validDescription, setValidDescription] = useState("");
  useEffect(() => {
    setValidProductName(
      PRODUCT_NAME_REGEX.test(productName) && productName.trim()
    );
  }, [productName]);

  const handleValidationProductName = (e) => {
    setProductName(e.target.value);
  };

  useEffect(() => {
    setValidPrice(PRICE_REGEX.test(price));
  }, [price]);

  const handleValidationPrice = (e) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    setValidQuantity(QUANTITY_REGEX.test(quantity));
  }, [quantity]);

  const handleValidationQuantity = (e) => {
    setQuantity(e.target.value);
  };

  useEffect(() => {
    setValidDescription(
      DESCRIPTION_REGEX.test(description) && description.trim()
    );
  }, [description]);

  const handleValidationDescription = (e) => {
    setDescription(e.target.value);
  };

  // --------------------- HANDLE CHANGE IMAGE -----------------------------
  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    console.log("Kiểm tra image: ", e.target.files);
  };

  // --------------------- HANDLE HANLDE UPLOAD IMAGE PRODUCT -----------------------------
  const handleUpload = async () => {
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
      toast.error("Ảnh có dung lượng nhỏ hơn 1MB");
    } else {
      try {
        if (productImage) {
          const formData = new FormData();
          formData.append("image", productImage);
          const response = await axios.post(
            `http://localhost:3500/product/upload`,
            formData
          );
          console.log("Response data:", response.data.image);
          const imagePath = response.data.image;

          if (imagePath) {
            console.log("Đã tải ảnh lên:", imagePath);
            toast.success("Thêm ảnh thành công");
            setProductImage(imagePath);
          } else {
            console.log("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
            toast.error("Lỗi: Không có đường dẫn ảnh sau khi tải lên.");
          }
        } else {
          console.log("Vui lòng chọn ảnh trước khi tải lên.");
          toast.error("Vui lòng chọn ảnh trước khi tải lên.");
        }
      } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error);
      }
    }
  };

  // --------------------- HANDLE UPDATE PRODUCT -----------------------------
  useEffect(() => {
    if (open) {
      setProductName(dataEditProduct.productName);
      setCategoryId(dataEditProduct.categoryId);
      setDescription(dataEditProduct.description);
      setQuantity(dataEditProduct.quantity);
      setPrice(dataEditProduct.price);
      setProductImage(dataEditProduct.productImage);
      setDiscount(dataEditProduct.discount);
      setSaleStartTime(dataEditProduct.saleStartTime);
      setSaleEndTime(dataEditProduct.saleEndTime);
    }
  }, [dataEditProduct]);

  const handleEditProduct = async (productID) => {
    if (validProductName === "") {
      toast.error("Tên sản phẩm không được để trống");
    } else if (discount === "") {
      toast.error("% giảm giá không được để trống");
    } else if (!validProductName) {
      toast.error(
        "Tên sản phẩm không được nhập kí tự đặc biệt và phải có ít nhất 3 kí tự"
      );
    } else if (discount < 0) {
      toast.error("% giảm giá không được âm ");
    } else if (discount > 100) {
      toast.error("% giảm giá không được lớn hơn 100");
    } else if (!validQuantity) {
      toast.error("Số lượng không được để trống");
    } else if (!validPrice) {
      toast.error("Giá tiền phải có ít nhất 4 chữ số và phải lớn hơn 0");
    } else if (!validDescription) {
      toast.error("Thông tin chi tiết không được để trống");
    } else {
      try {
        const res = await axios.patch(`http://localhost:3500/product`, {
          id: productID,
          productName: productName,
          categoryId: categoryId,
          description: description,
          quantity: quantity,
          price: price,
          discount: discount,
          saleStartTime: saleStartTime,
          saleEndTime: saleEndTime,
          productImage: productImage,
        });
        if (res.data.error) {
          toast.error("Lỗi Err", res.data.error);
        } else {
          toast.success("Sửa thông tin sản phẩm thành công");
          handUpdateEditTable(page);
          onClose();
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // --------------------- HANDLE CHANGE CATEGORY PRODUCT -----------------------------
  const handleChange = (e) => {
    const selectedCategory = e.target.value;
    console.log("Check ID cate add Product", selectedCategory);
    setCategoryId(selectedCategory);
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
          Sửa thông tin sản phẩm
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
              // required
              fullWidth
              label="Tên sản phẩm"
              margin="normal"
              value={productName}
              onChange={(e) => handleValidationProductName(e)}
              // error={!validProductName}
              // helperText={validProductName ? "" : "Hãy nhập tên sản phẩm"}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-select-small-label">
                Chọn loại sản phẩm
              </InputLabel>
              <Select
                label="Loại sản phẩm"
                value={categoryId}
                onChange={handleChange}
              >
                {category &&
                  category.map((value) => {
                    return (
                      <MenuItem
                        key={value._id}
                        value={value._id}
                        // onClick={(e) => hanldeClickCategory(e.target.value)}
                      >
                        {value.feature}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>

            <TextField
              // required
              fullWidth
              label="Số lượng"
              margin="normal"
              type="number"
              value={quantity}
              onChange={(e) => handleValidationQuantity(e)}
              // error={!validQuantity}
              // helperText={validQuantity ? "" : "Hãy nhập số lượng sản phẩm"}
            />

            <TextField
              required
              fullWidth
              label="Giá tiền sản phẩm"
              type="number"
              margin="normal"
              value={price}
              onChange={(e) => handleValidationPrice(e)}
              InputProps={{
                readOnly: true,
              }}
              variant="filled"
              // error={!validPrice}
              // helperText={validPrice ? "" : "Hãy nhập giá tiền sản phẩm"}
            />

            <TextField
              required
              fullWidth
              label="Giảm giá(%)"
              type="number"
              margin="normal"
              value={discount}
              onChange={handleDiscountChange}
            />
            {isStartDateVisible && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Ngày bắt đầu giảm giá"
                    value={saleStartTime}
                    onChange={handleStartDateChange}
                    // minDate={currentDate}
                    // maxDate={currentDate}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Ngày kết thúc giảm giá"
                    value={saleEndTime}
                    onChange={handleEndDateChange}
                  />
                </Grid>
              </Grid>
            )}

            <TextField
              label="Thông tin sản phẩm"
              fullWidth
              placeholder="Điền thông tin sản phẩm ở đây"
              multiline
              rows={4}
              margin="normal"
              maxRows={4}
              value={description}
              onChange={(e) => handleValidationDescription(e)}
            />

            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
            />
            <Button onClick={handleUpload}>Tải ảnh lên</Button>
            {productImage && (
              <img
                src={productImage}
                alt="Ảnh sản phẩm"
                style={{ maxWidth: "100%" }}
              />
            )}

            {/* Status */}
            {/* <RadioGroup
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
            </RadioGroup> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            margin="normal"
            color="primary"
            onClick={() => handleEditProduct(dataEditProduct._id)}
          >
            Sửa
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalEditProduct;
