---
title: Android Studio JNI样例代码
date: 2020-05-28
author: hugo
tags:
    android studio, jni, ndk
---

这里给出一个最简单的 Android Studio JNI 工程中做. 里面包含了响应 Java 层的调用，在 cpp native 代码中异步对 Java 层的回调.

先给出实现步骤:

* 新建一个 Android Studio JNI 工程
* 在 Java 中的 MainActivity 中, 添加如下代码
```java
public class MainActivity extends AppCompatActivity {
    ...
    public void onNativeRecv(final String s) { // JNI 的会调用这个函数
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                android.util.Log.d(TAG, "onRecv:" + s);
            }
        });
    }
    public native void nativeInit(String s); // 实现在 JNI cpp 代码中
    public native void nativeSend(String s); // 实现在 JNI cpp 代码中
}
```
* 修改 native-lib.cpp 文件, 
以下直接给出一个 `native-lib.cpp` 的修改后代码. 其它文件, 直接

```cpp
#include <string>
#include <thread>
#include <jni.h>
#include <android/log.h>

#define LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG, "Native", __VA_ARGS__)

static JavaVM *gJVM = nullptr;
static jobject mainActivity = nullptr;
static int counter = 0;
static pthread_key_t gThreadKey;

JNIEnv* cacheEnv() {
    if (nullptr == gJVM) {
        return nullptr;
    }
    JNIEnv* env = nullptr;
    jint ret = gJVM->GetEnv((void**)&env, JNI_VERSION_1_4);
    switch (ret) {
        case JNI_OK: {
            pthread_setspecific(gThreadKey, env);
            break;
        }
        case JNI_EDETACHED: {
            if (gJVM->AttachCurrentThread(&env, nullptr) >= 0) {
                pthread_setspecific(gThreadKey, env);
            }
            break;
        }
    }

    return env;
}

void testThread() {
    JNIEnv* env = cacheEnv();
    while (true) {
        if (nullptr == mainActivity) {
            return;
        }
        std::this_thread::sleep_for(std::chrono::seconds(10));

        jclass clazz = env->GetObjectClass(mainActivity);
        jmethodID method = env->GetMethodID(clazz, "onNativeRecv", "(Ljava/lang/String;)V");
        if (nullptr == method) {
            return;
        }
        std::string s = "native callback:";
        s += std::to_string(++counter);
        env->CallVoidMethod(mainActivity, method, env->NewStringUTF(s.c_str()));
    }
}

extern "C"
JNIEXPORT void JNICALL
Java_xyz_betterbridge_test_betterbridgetest_MainActivity_nativeInit(JNIEnv *env, jobject thiz,
                                                                    jstring s) {
    env->GetJavaVM(&gJVM);
    if (nullptr != mainActivity) {
        env->DeleteGlobalRef(mainActivity);
        mainActivity = nullptr;
    }
    mainActivity = env->NewGlobalRef(thiz);

    const char* c_str;
    c_str = env->GetStringUTFChars(s, nullptr);
    if(c_str == nullptr) {
        return;
    }
    std::string ss(c_str);
    env->ReleaseStringUTFChars(s, c_str);
    LOGD("nativeInit:%s", ss.c_str());

    pthread_key_create(&gThreadKey, nullptr);
    std::thread t(testThread);
    t.detach();
}

extern "C"
JNIEXPORT void JNICALL
Java_xyz_betterbridge_test_betterbridgetest_MainActivity_nativeSend(JNIEnv *env, jobject thiz,
                                                                    jstring s) {
    const char* c_str;
    c_str = env->GetStringUTFChars(s, nullptr);
    if(c_str == nullptr) {
        return;
    }
    std::string ss(c_str);
    env->ReleaseStringUTFChars(s, c_str);
    LOGD("nativeSend:%s", ss.c_str());
}
```

讲解一下:

- java 调用 cpp

java 中的 `nativeInit` 和 `nativeSend` 函数在 `native-lib.cpp` 中必须要用对应的实现，也就是 `Java_xyz_betterbridge_test_betterbridgetest_MainActivity_nativeInit` 和 `Java_xyz_betterbridge_test_betterbridgetest_MainActivity_nativeSend`.

从对应关系，函数名字，就可以依样画瓢写给其它函数了. 这里也

- cpp 调用 java

在 java 中有函数 `onNativeRecv` , 在 cpp 的 `testThread` 中包含了对应的调用代码(这里为了演示，会不断调用). 从 `testThread` 可以看出, 调用逻辑就是通过 jobject 找到 jclass ,然后再找到对应的 jmethodID , 然后就可以传参数，直接调用了.

注意:
    1. JNI 中的调用，都应应该传 JNI 自有的参数类型, 比如不能传 std::string , 而应该传 jstring.
    2. cpp 调用 java , 需要 JavaVM, JNIEnv 的值, 这些值是在 java 调用 cpp 时，就应该保存下来(注意 JNIEnv 获取方式)


---
转自: [HH](http://www.hugohuang.xyz/)
