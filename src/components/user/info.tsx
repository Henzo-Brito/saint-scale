/* import { UserRoundMinus } from "lucide-react-native"; */
import {
    /* Image,
    type ImageSourcePropType, */
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import sty from "@/constants/styles";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faCakeCandles } from "@fortawesome/free-solid-svg-icons/faCakeCandles";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

type Props = {
    email: string;
    password: string;
    address: string;
    birth: string;
    phone: string;
};

const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    
    if (!domain) return email;

    const visibleStart = name.slice(0, 2);
    const visibleEnd = domain.slice(-3);

    return `${visibleStart}${"*".repeat(name.length + domain.length - 5)}${visibleEnd}`;
};

const maskPassword = (password: string) => {
    return "*".repeat(password.length);
};

export default function Info({ email, password, address, birth, phone }: Props) {
    return (
        <View style={style.container}>
            <View style={style.size}>
                <View style={style.boxSize}>
                    <FontAwesomeIcon icon={faEnvelope} size={28} color={sty.c5} />
                    <Text style={style.title} numberOfLines={1}>
                        {maskEmail(email)}
                    </Text>
                </View>
                <View style={[style.boxEdit, {flexDirection: "row", gap: 10}]}>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faPencil} size={22} color={sty.c5} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faEye} size={22} color={sty.c5} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={style.line} />

            <View style={style.size}>
                <View style={style.boxSize}>
                    <FontAwesomeIcon icon={faLock} size={28} color={sty.c5} />
                    <Text style={style.title} numberOfLines={1}>
                        {maskPassword(password)}
                    </Text>
                </View>
                <TouchableOpacity style={style.boxEdit}>
                    <FontAwesomeIcon icon={faPencil} size={22} color={sty.c5} />
                </TouchableOpacity>
            </View>

            <View style={style.line} />

            <View style={style.size}>
                <View style={style.boxSize}>
                    <FontAwesomeIcon icon={faLocationDot} size={28} color={sty.c5} />
                    <Text style={style.title} numberOfLines={1} ellipsizeMode="tail">
                        {address}
                    </Text>
                </View>
                <TouchableOpacity style={style.boxEdit}>
                    <FontAwesomeIcon icon={faPencil} size={22} color={sty.c5} />
                </TouchableOpacity>
            </View>

            <View style={style.line} />

            <View style={style.size}>
                <View style={style.boxSize}>
                    <FontAwesomeIcon icon={faCakeCandles} size={28} color={sty.c5} />
                    <Text style={style.title} numberOfLines={1}>
                        {birth}
                    </Text>
                </View>
                <TouchableOpacity style={style.boxEdit}>
                    <FontAwesomeIcon icon={faPencil} size={22} color={sty.c5} />
                </TouchableOpacity>
            </View>

            <View style={style.line} />

            <View style={style.size}>
                <View style={style.boxSize}>
                    <FontAwesomeIcon icon={faPhone} size={28} color={sty.c5} />
                    <Text style={style.title} numberOfLines={1}>
                        {phone}
                    </Text>
                </View>
                <TouchableOpacity style={style.boxEdit}>
                    <FontAwesomeIcon icon={faPencil} size={22} color={sty.c5} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        padding: 14,
        backgroundColor: sty.c8,
        borderRadius: 10,
        width: "100%",
        gap: 12,
    },
    size: {
        alignItems: "center",
        flexDirection: "row",
    },
    boxSize: {
        flex: 1,
        flexDirection: "row",
        gap: 18,
        alignItems: "center",
        overflow: "hidden",
    },
    boxEdit: {
        position: "absolute",
        right: 0,
    },
    title: {
        flex: 1,
        minWidth: 0,
        fontWeight: 600,
        fontSize: 16,
        overflow: "hidden",
        color: sty.c5,
    },
    subTitle: {
        fontWeight: 400,
        fontSize: 12,
        overflow: "hidden",
        color: sty.c4,
    },
    line: {
        width: "100%",
        height: 1,
        backgroundColor: sty.c11,
    },
});
