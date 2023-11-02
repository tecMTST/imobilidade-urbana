using Cinemachine;
using System.Collections;
using System.Collections.Generic;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public class DeveloperMode : MonoBehaviour{


    public Light2D GlobalLightCity;
    public Light2D[] lamps;
    public Volume volume;
    public GameObject cityBack;


    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetDeveloperMode(bool devMode) {

        switch (devMode) { 
            case true:
                DevMode();
                break;

            case false:
                StandardMode();
                break;
                     
        }

    }

    public void SetLightMode(bool lampMode) {
        switch (lampMode) {
            case true:
                LampsLightining();
                break;

            case false:
                CityLightining();
                break;

        }
    }

    private void DevMode() {

    }

    private void StandardMode() {
        

    }

    private void LampsLightining() {
        SetPostProcessing(false);
        GlobalLightCity.enabled = false;

        foreach (Light2D lamp in lamps) 
            lamp.enabled = true;
        
        cityBack.SetActive(false);  
    }

    private void CityLightining() {
        SetPostProcessing(true);
        GlobalLightCity.enabled = true;

        foreach (Light2D lamp in lamps) 
            lamp.enabled = false;
        
        cityBack.SetActive(true);


    }

    private void SetPostProcessing(bool on) {
        volume.enabled = on;   
    }
}
