using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.SceneManagement;

public class DebugAndStrip : MonoBehaviour
{
    UpDownMovement[] moveUpAndDown;

    int key = 1;

    // Start is called before the first frame update
    void Start()
    {
        DontDestroyOnLoad(this);
        moveUpAndDown = GameObject.FindObjectsByType<UpDownMovement>(FindObjectsSortMode.InstanceID);

        if (moveUpAndDown == null) ;
            
    }

    // Update is called once per frame
    void Update()
    {
        LoadSceneByInput();





    }


    void LoadSceneByInput() {
        if (Input.GetKeyDown(KeyCode.Alpha0) || Input.GetKeyDown(KeyCode.Keypad0)) 
            SceneManager.LoadScene(0);

         else if (Input.GetKeyDown(KeyCode.Alpha1) || Input.GetKeyDown(KeyCode.Keypad1)) 
            SceneManager.LoadScene(1);

         else if (Input.GetKeyDown(KeyCode.Alpha2) || Input.GetKeyDown(KeyCode.Keypad2)) 
            SceneManager.LoadScene(2);

         else if (Input.GetKeyDown(KeyCode.Alpha3) || Input.GetKeyDown(KeyCode.Keypad3)) 
            SceneManager.LoadScene(3);

         else if (Input.GetKeyDown(KeyCode.Alpha4) || Input.GetKeyDown(KeyCode.Keypad4)) 
            SceneManager.LoadScene(4);      
    }
}
