import React, { useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    PermissionsAndroid,
    Platform,
    Alert,
    ActivityIndicator,
    Text,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface LivenessWebViewProps {
    sessionId: string;
    region: string;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
}

const LIVENESS_URL = 'https://endurant-nonnutritively-kimber.ngrok-free.dev/liveness.html'; // REPLACE WITH YOUR HOSTED URL

export const LivenessWebView: React.FC<LivenessWebViewProps> = ({
    sessionId,
    region,
    onSuccess,
    onError,
}) => {
    const [hasPermission, setHasPermission] = React.useState<boolean | null>(
        null,
    );

    const requestCameraPermission = useCallback(async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to your camera for face liveness check.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
            } catch (err) {
                console.warn(err);
                setHasPermission(false);
            }
        } else {
            setHasPermission(true); // iOS permission handled by WebView/OS
        }
    }, []);

    useEffect(() => {
        requestCameraPermission();
    }, [requestCameraPermission]);

    const onMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);


            // Handle WebView logs forwarded via bridge
            if (data.type === 'WEBVIEW_LOG') {
                const prefix = `[WEBVIEW][${data.level}]`;
                switch (data.level) {
                    case 'ERROR':
                    case 'RUNTIME_ERROR':
                    case 'PROMISE_REJECTION':
                        console.error(prefix, data.payload);
                        break;
                    case 'WARN':
                        console.warn(prefix, data.payload);
                        break;
                    default:
                        console.log(prefix, data.payload);
                }
                return;
            }

            console.log('WebView Message:', data);

            if (data.status === 'SUCCESS') {
                onSuccess(data);
            } else if (data.status === 'ERROR') {
                console.error('[WEBVIEW][LIVENESS_ERROR]', data.error);
                onError(data.error);
            }
        } catch (e) {
            console.error('[WEBVIEW][PARSE_ERROR] Failed to parse message from WebView', e);
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red' }}>Camera permission is required.</Text>
            </View>
        );
    }

    // const urlWithParams = `${LIVENESS_URL}?sessionId=${sessionId}&region=${region}`;
    const urlWithParams = `${LIVENESS_URL}?sessionId=${sessionId}`;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: urlWithParams }}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={onMessage}
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator
                        style={styles.loading}
                        size="large"
                        color="#0000ff"
                    />
                )}
                // Important for Android: allow camera access
                onPermissionRequest={(event: any) => {
                    event.grant(event.resources);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
