import React, {useState} from 'react';
import { TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native'

const AccordionListItem = (props) => {
    const [open, setOpen] = useState(false);
    const animatedController = useRef(new Animated.Value(0)).current;
    const [bodySectionHeight, setBodySectionHeight] = useState(0);

    const bodyHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, size.height],
    })

    const toggleListItem = () => {
        if (open) {
          Animated.timing(animatedController, {
            duration: 300,
            toValue: 0,
          }).start();
        } else {
          Animated.timing(animatedController, {
            duration: 300,
            toValue: 1,
          }).start();
        }
        setOpen(!open);
    }

    const arrowAngle = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: ["0rad", `${Math.PI}rad`],
    });

    return (
        <TouchableWithoutFeedback>
            <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
                <View onLayout={setSize} style={styles.bodyContainer}>
                    {props.children}
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({

})

export default AccordionListItem;