import RoundButton from "@/components/roundButton";
import TextInput from "@/components/textinput";
import { Text, theme } from "@/components/theme";
import { globalStyles } from "@/styles/globalStyles";
import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import Back from "@/assets/svg/arrow-left.svg";
import Sms from "@/assets/svg/sms.svg";
import User from "@/assets/svg/frame.svg";
import Phone from "@/assets/svg/mobile.svg";
import Calendar from "@/assets/svg/calendar.svg";
import BaseButton from "@/components/baseBtn";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useEditProfile } from "@/hooks/useEditProfile";
import { showToast } from "@/components/toast";
import { useTranslation } from "react-i18next";
import ImageUpload from "@/components/imageUpload";

interface personalProps {
  visible?: boolean;
  onBackToProfileClicked: () => void;
  refetch: Function;
}

const PersonalDataModal = ({
  visible,
  onBackToProfileClicked,
  refetch,
}: personalProps) => {
  const { t } = useTranslation();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const { data } = useGetProfile();
  const [img, setimg] = useState<any>();

  const { mutate, isPending } = useEditProfile({
    onSuccess(data) {
      showToast("successToast", data.message, "top");
      refetch();
      onBackToProfileClicked();
    },
    onError(error: any) {
      showToast("errorToast", error.errors?.message, "top");
    },
  });

  const profilepic = useMemo(() => {
    if (!img?.uri) return null;
    return {
      uri: img.uri,
      type: img.type || "image/jpeg",
      name: img.name || "profile.jpg",
    };
  }, [img]);

  const handleSubmit = () => {
    mutate({
      name,
      email,
      dob,
      phone,
      profile_image: profilepic,
    });
  };
  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={visible}
      style={styles.modal}
      animationIn={"fadeInRight"}
      animationOut={"fadeOutRight"}
      presentationStyle="overFullScreen"
    >
      <SafeAreaView style={styles.modalContent}>
        <View style={[globalStyles.container, styles.container]}>
          <View style={styles.margin}>
            <View style={globalStyles.line2}>
              <RoundButton onPress={onBackToProfileClicked}>
                <Back color={theme.colors.black} />
              </RoundButton>
              <Text variant="poppins18black_semibold" me="s">
                {t("personal_data")}
              </Text>
              <View />
            </View>
            <ImageUpload
              onSelect={(e) => setimg(e)}
              img={data?.profile_image}
            />
            <TextInput
              placeholder={t("name_placeholder")}
              leftIcon={<User />}
              onChangeText={(e) => setName(e)}
              defaultValue={data?.name}
            />
            <TextInput
              placeholder={t("email_placeholder")}
              leftIcon={<Sms />}
              onChangeText={(e) => setEmail(e)}
              defaultValue={data?.email}
            />
            <TextInput
              placeholder={t("phone_placeholder")}
              leftIcon={<Phone />}
              keyboardType="number-pad"
              onChangeText={(e) => setPhone(e)}
              defaultValue={data?.phone}
            />
            <TextInput
              placeholder="DOB"
              leftIcon={<Calendar />}
              keyboardType="number-pad"
              onChangeText={(e) => setDob(e)}
              defaultValue={data?.dob}
            />
          </View>
          <BaseButton
            label={t("edit")}
            isLoading={isPending}
            disabled={isPending}
            onPress={handleSubmit}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is important to ensure the modal takes up the full screen
  },
  container: { padding: "5%" },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  img: { alignSelf: "center", marginTop: "5%" },
  margin: { marginTop: "5%" },
});

export default PersonalDataModal;
