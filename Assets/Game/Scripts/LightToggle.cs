using System;
using UnityEngine;
using UnityEngine.UI;

public class LightToggle : MonoBehaviour
{

    public static LightToggle Instance;

    public UnityEngine.Rendering.Universal.Light2D light2D;
    public UnityEngine.Rendering.Universal.Light2D light2D2; 
    
    public Image lanternToggle;
    public Sprite imageOff;
    public Sprite imageOn;

    [HideInInspector]
    public bool lightActive;

    private Toggle toggle;
    //Lista de SFX:
    [SerializeField] private AudioClip sfxLight;

    private void Start()
    {
        Instance = this;

        toggle = this.GetComponent<Toggle>();



    }

    

    public void ToggleLight(bool active){

        lightActive = active;
        ToggleLight();

        if (!active)     
            toggle.interactable = false;
            Invoke(nameof(AllowToggle), 1f);
        

    }

    void AllowToggle() {
        toggle.interactable = true;
    }

    

    private void ToggleLight() {

        //light2D.enabled = !light2D.enabled;
        light2D.gameObject.SetActive(lightActive);
        light2D2.gameObject.SetActive(lightActive);
        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroLuz);

        if (lightActive) {
            lanternToggle.sprite = imageOn;
        } else {
            lanternToggle.sprite = imageOff;
        }
    }
}
