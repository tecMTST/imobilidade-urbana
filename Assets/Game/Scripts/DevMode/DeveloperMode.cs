using System.Collections;
using System.Collections.Generic;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.Rendering.Universal;

public class DeveloperMode : MonoBehaviour{


    public Light2D GlobalLightCity;

    private bool isDeveloperMode = false;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetDeveloperMode(bool devMode) {

        isDeveloperMode = devMode;

        switch (devMode) { 
            case true:
                DevMode();
                break;

            case false:
                StandardMode();
                break;
                     
        }

    }

    private void DevMode() {

    }

    private void StandardMode() {

    }

    private void LightiningOne() { 
    }

    private void LightiningTwo() { 
    }
}
